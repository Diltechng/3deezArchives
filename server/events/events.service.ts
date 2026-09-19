import { db } from "@/server/db";
import { categories, media, events } from "@/server/db/schema";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "@/server/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { EventVisibility, UserRole } from "@/shared/constants/enums";
import { and, asc, desc, eq, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { softDelete } from "../shared/helpers/soft-delete";
import { CreateEventPayload, GetEventsQuery, UpdateEventPayload } from "@/shared/schemas";
import { buildDateFilter, buildPaginationMeta, buildSearch, getPagination } from "../utils";
import { eventDetailProjection, eventListProjection } from "./events.projections";
import { Principal } from "../shared/types";

class EventsService {
  async createEvent(user: Principal, data: CreateEventPayload) {
    if (!data.media.ids.includes(data.media.coverId))
      throw new ForbiddenError("Cover image must exist in attached media.", {
        code: ApiErrorCode.INVALID_COVER_IMAGE_REFERENCE
      })
    
    const [validMedia] = await db
      .select({ id: media.id })
      .from(media)
      .where(and(
        eq(media.id, data.media.coverId),
        eq(media.uploadedBy, user.userId),
        isNull(media.eventId),
      ));

    if (!validMedia) {
      throw new ForbiddenError("You do not own this media asset.", {
        code: ApiErrorCode.FORBIDDEN_COVER_MEDIA_SELECTION
      });
    }

    const result = await db.transaction(async tx => {
      const [storedEvent] = await tx.insert(events).values({
        title: data.title,
        visibility: data.visibility,
        dateOfMoment: data.dateOfMoment,
        description: data.description,
        tags: data.tags,
        categoryId: data.categoryId,
        coverMediaId: data.media.coverId,
        uploadedBy: user.userId,
      }).returning({
        id: events.id,
        title: events.title,
      });

      const storedMedia = await tx.update(media).set({
        eventId: storedEvent.id,
      }).where(and(
        inArray(media.id, data.media.ids),
        eq(media.uploadedBy, user.userId),
        isNull(media.eventId),
      )).returning({
        id: media.id,
        secureUrl: media.secureUrl,
      });

      if (storedMedia.length !== data.media.ids.length)
        throw new InternalServerError("Some media could not be attached to this event.");

      return {
        ...storedEvent,
        uploadedMedia: storedMedia
      };
    });

    return result;
  }

  async getAllEvents(user: Principal, query: GetEventsQuery) {
    const conditions = [
      or(
        and(
          eq(events.visibility, EventVisibility.PRIVATE),
          eq(events.uploadedBy, user.userId)
        ),
        ne(events.visibility, EventVisibility.PRIVATE),
      ),
      buildSearch(
        [events.title, events.description],
        query.search,
      ),
      buildDateFilter(
        events.dateOfMoment,
        query.startDate,
        query.endDate,
      ),
      user.role !== UserRole.ADMIN
        ? ne(events.visibility, EventVisibility.ADMIN_ONLY)
        : undefined,
      query.visibility
        ? eq(events.visibility, query.visibility)
        : undefined,
      isNull(events.deletedAt)
    ].filter(Boolean);

    if (query.categorySlug) {
      const [category] = await db.select({ id: categories.id })
        .from(categories)
        .where(and(
          eq(categories.slug, query.categorySlug),
          isNull(categories.deletedAt)
        ));

      if (!category) {
        throw new NotFoundError("No such category exists", {
          code: ApiErrorCode.CATEGORY_NOT_FOUND,
        });
      }

      conditions.push(eq(events.categoryId, category.id));
    }

    const whereClause = and(...conditions);

    const orderCriteria = query.sortBy === "oldest"
      ? [asc(events.dateOfMoment), asc(events.id)]
      : [desc(events.dateOfMoment), desc(events.id)];

    const paginationQuery = getPagination({
      page: query.page,
      limit: query.limit
    });
    
    const [countResult, eventsResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(whereClause),
        
      db.query.events.findMany({
        where: whereClause,
        orderBy: orderCriteria,
        offset: paginationQuery.offset,
        limit: paginationQuery.limit,
        ...eventListProjection,
      }),
    ]);

    const count = countResult[0]?.count ?? 0;

    const pagination = buildPaginationMeta(
      paginationQuery.page,
      paginationQuery.limit,
      count,
    );
    
    return {
      events: eventsResult,
      meta: { pagination },
    };
  }

  async getEventById(user: Principal, eventId: string) {
    const conditions = [
      eq(events.id, eventId),
      or(
        and(
          eq(events.visibility, EventVisibility.PRIVATE),
          eq(events.uploadedBy, user.userId)
        ),
        ne(events.visibility, EventVisibility.PRIVATE),
      ),
      user.role !== UserRole.ADMIN
        ? ne(events.visibility, EventVisibility.ADMIN_ONLY)
        : undefined,
      isNull(events.deletedAt)
    ].filter(Boolean);

    const result = await db.query.events.findFirst({
      where: and(...conditions),
      ...eventDetailProjection,
    });

    if (!result) {
      throw new NotFoundError("Event does not exist or is not accessible to you.", {
        code: ApiErrorCode.EVENT_NOT_FOUND
      });
    }

    return result;
  }

  async updateEventById(user: Principal, eventId: string, data: UpdateEventPayload) {
    if (data.media.coverId) {
      const attachmentConditions = [
        eq(media.id, data.media.coverId),
        eq(media.uploadedBy, user.userId),
        isNull(media.deletedAt),
        eq(media.eventId, eventId),
      ];

      const [validCoverMedia] = await db
        .select({ id: media.id })
        .from(media)
        .where(and(...attachmentConditions));

      if (!validCoverMedia) {
        throw new ForbiddenError("Invalid media selection.", {
          code: ApiErrorCode.FORBIDDEN_COVER_MEDIA_SELECTION
        });
      }
    }

    const updateEntries = Object.entries({
      title: data.title,
      categoryId: data.categoryId,
      coverMediaId: data.media.coverId,
      dateOfMoment: data.dateOfMoment,
      description: data.description,
      tags: data.tags,
      visibility: data.visibility,
    }).filter(([_, value]) => value !== undefined);

    if (!updateEntries.length) {
      throw new BadRequestError("You must provide at least one field to update", {
        code: ApiErrorCode.INVALID_UPDATE_EVENT_DATA
      });
    }

    const updateData = Object.fromEntries(updateEntries);

    const updateConditions = [
      eq(events.id, eventId),
      isNull(events.deletedAt)
    ];

    if (user.role !== UserRole.ADMIN) {
      updateConditions.push(
        eq(events.uploadedBy, user.userId)
      )
    }

    const [updatedEvent] = await db.update(events)
      .set({
        ...updateData,
      })
      .where(and(...updateConditions))
      .returning({
        id: events.id
      });
    
    if (!updatedEvent) {
      throw new NotFoundError("Could not update this event because it is not found", {
        code: ApiErrorCode.EVENT_NOT_FOUND,
      })
    }

    return updatedEvent;
  }

  async deleteEventById(user: Principal, eventId: string) {
    const deleteConditions = [
      eq(events.id, eventId),
      isNull(events.deletedAt),
    ];

    if (user.role !== UserRole.ADMIN) {
      deleteConditions.push(
        eq(events.uploadedBy, user.userId),
      );
    }

    return await db.transaction(async tx => {
      const [deletedEvent] = await softDelete(tx, events, {
        actorId: user.userId,
        where: and(...deleteConditions)
      }).returning({ id: events.id });

      if (!deletedEvent) {
        throw new ForbiddenError("Invalid event deletion operation.", {
          code: ApiErrorCode.INVALID_DELETE_OPERATION
        })
      }

      const deletedMedia = await softDelete(tx, media, {
        actorId: user.userId,
        where: and(
          eq(media.eventId, deletedEvent.id)
        )
      }).returning({ id: media.id });

      return {
        ...deletedEvent,
        media: deletedMedia
      }
    });
  }
}

export const eventsService = new EventsService();