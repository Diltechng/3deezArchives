import { db } from "@/db";
import { categories, media, events } from "@/db/schema";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "@/server/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { EventVisibility, UserRole } from "@/shared/constants/enums";
import { and, asc, desc, eq, gte, ilike, inArray, isNull, lte, ne, or, sql } from "drizzle-orm";
import { softDelete } from "../shared/helpers/soft-delete";
import { DeleteOneEventInput, GetOneEventInput, GetEventsInput, UpdateOneEventInput } from "./events.types";
import { CreateEventPayload } from "@/shared/schemas";

class EventsService {
  async createNewEvent(userId: string, data: CreateEventPayload) {
    if (!data.media.ids.includes(data.media.coverId))
      throw new ForbiddenError("Cover image must exist in attached media.", {
        code: ApiErrorCode.INVALID_COVER_IMAGE_REFERENCE
      })
    
    const [validMedia] = await db
      .select({ id: media.id })
      .from(media)
      .where(and(
        eq(media.id, data.media.coverId),
        eq(media.uploadedBy, userId),
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
        uploadedBy: userId,
      }).returning({
        id: events.id,
        title: events.title,
      });

      const storedMedia = await tx.update(media).set({
        eventId: storedEvent.id,
      }).where(and(
        inArray(media.id, data.media.ids),
        eq(media.uploadedBy, userId),
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

  async getEvents(data: GetEventsInput) {
    const visibilityConditions = [
      or(
        and(
          eq(events.visibility, EventVisibility.PRIVATE),
          eq(events.uploadedBy, data.userId)
        ),
        ne(events.visibility, EventVisibility.PRIVATE),
      ),
      isNull(events.deletedAt)
    ];

    if (data.userRole !== UserRole.ADMIN) {
      visibilityConditions.push(
        ne(events.visibility, EventVisibility.ADMIN_ONLY)
      )
    }

    const filters = [...visibilityConditions];

    const { limit, page, search, visibility, categorySlug, date, sortBy } = data.filters;
    if (search) {
      filters.push(or(
        ilike(events.title, `%${search}%`),
        ilike(events.description, `%${search}%`)
      ));
    }

    if (visibility) {
      filters.push(eq(events.visibility, visibility));
    }

    if (date.from) {
      filters.push(gte(events.dateOfMoment, date.from));
    }

    if (date.to) {
      filters.push(lte(events.dateOfMoment, date.to));
    }

    if (categorySlug) {
      const [category] = await db.select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, categorySlug));

      if (!category) {
        throw new NotFoundError("No such category exists", {
          code: ApiErrorCode.CATEGORY_NOT_FOUND,
        });
      }

      filters.push(eq(events.categoryId, category.id));
    }

    const orderCriteria = sortBy === "oldest"
      ? [asc(events.dateOfMoment), asc(events.id)]
      : [desc(events.dateOfMoment), desc(events.id)];

    const offset = (page - 1) * limit;

    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
      .from(events)
      .where(and(...filters));

    const result = await db.query.events.findMany({
      where: and(...filters),
      orderBy: orderCriteria,
      offset,
      limit,
      columns: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        tags: true,
        dateOfMoment: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        coverMedia: {
          columns: {
            id: true,
            secureUrl: true,
            createdAt: true,
            bytes: true,
            width: true,
            height: true,
            uploadedBy: true,
          }
        },
        media: {
          columns: {
            id: true,
            secureUrl: true,
            createdAt: true,
            bytes: true,
            width: true,
            height: true,
            uploadedBy: true,
          }
        },
        uploadedByUser: {
          columns: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });
    
    return {
      events: result,
      meta: {
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNextPage: page < Math.ceil(count / limit),
          hasPreviousPage: page > 1,
        }
      },
    };
  }

  async getOneEvent(data: GetOneEventInput) {
    const visibilityConditions = [
      or(
        and(
          eq(events.visibility, EventVisibility.PRIVATE),
          eq(events.uploadedBy, data.userId)
        ),
        ne(events.visibility, EventVisibility.PRIVATE),
      ),
      isNull(events.deletedAt)
    ];

    if (data.userRole !== UserRole.ADMIN) {
      visibilityConditions.push(
        ne(events.visibility, EventVisibility.ADMIN_ONLY)
      )
    }

    const mediaPreviewColumns = {
      columns: {
        id: true,
        secureUrl: true,
        width: true,
        height: true,
        bytes: true,
        createdAt: true,
        uploadedBy: true,
      }
    } as const;

    const result = await db.query.events.findFirst({
      where: and(eq(events.id, data.eventId), ...visibilityConditions),
      columns: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        tags: true,
        dateOfMoment: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        coverMedia: mediaPreviewColumns,
        media: mediaPreviewColumns,
        uploadedByUser: {
          columns: {
            id: true,
            name: true,
            role: true,
          }
        },
      },
    });

    if (!result) {
      throw new NotFoundError("Event does not exist or is not accessible to you.", {
        code: ApiErrorCode.EVENT_NOT_FOUND
      });
    }

    return result;
  }

  async updateOneEvent(data: UpdateOneEventInput) {
    if (data.data.media.coverId) {
      const attachmentConditions = [
        eq(media.id, data.data.media.coverId),
        eq(media.uploadedBy, data.userId),
        isNull(media.deletedAt),
        eq(media.eventId, data.eventId),
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
      title: data.data.title,
      categoryId: data.data.categoryId,
      coverMediaId: data.data.media.coverId,
      dateOfMoment: data.data.dateOfMoment,
      description: data.data.description,
      tags: data.data.tags,
      visibility: data.data.visibility,
    }).filter(([_, value]) => value !== undefined);

    if (!updateEntries.length) {
      throw new BadRequestError("You must provide at least one field to update", {
        code: ApiErrorCode.INVALID_UPDATE_EVENT_DATA
      });
    }

    const updateData = Object.fromEntries(updateEntries);

    const updateConditions = [
      eq(events.id, data.eventId),
      isNull(events.deletedAt)
    ];

    if (data.userRole !== UserRole.ADMIN) {
      updateConditions.push(
        eq(events.uploadedBy, data.userId)
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

  async deleteOneEvent(data: DeleteOneEventInput) {
    const deleteConditions = [
      eq(events.id, data.eventId),
    ];

    if (data.userRole !== UserRole.ADMIN) {
      deleteConditions.push(
        eq(events.uploadedBy, data.userId),
      );
    }

    return await db.transaction(async tx => {
      const [deletedEvent] = await softDelete(tx, events, {
        actorId: data.userId,
        where: and(...deleteConditions)
      }).returning({ id: events.id });

      if (!deletedEvent) {
        throw new ForbiddenError("Invalid event deletion operation.", {
          code: ApiErrorCode.INVALID_DELETE_OPERATION
        })
      }

      const deletedMedia = await softDelete(tx, media, {
        actorId: data.userId,
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