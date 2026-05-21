import { db } from "@/db";
import { categories, media, moments } from "@/db/schema";
import { ApiErrorCode, ForbiddenError, InternalServerError } from "@/lib/errors";
import { MomentVisibility, UserRole } from "@/shared/constants/enums";
import { CreateMomentInput } from "@/shared/schemas/create-moment.schema";
import { and, desc, eq, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { mediaSelect } from "./media.service";

interface CreateNewMomentInput {
  data: CreateMomentInput;
  userId: string;
}

interface GetMomentsInput {
  user: {
    id: string;
    role: string;
  };
}

const momentsSelect = {
  id: moments.id,
  title: moments.title,
  description: moments.description,
  visibility: moments.visibility,
  uploadedBy: moments.uploadedBy,
  coverMediaId: moments.coverMediaId,
  tags: moments.tags,
  dateOfMoment: moments.dateOfMoment,
  createdAt: moments.createdAt,
  updatedAt: moments.updatedAt,
}

class MomentsService {
  async createNewMoment(data: CreateNewMomentInput) {
    if (!data.data.mediaIds.includes(data.data.coverMediaId))
      throw new ForbiddenError("Cover image must belong to attached media.", {
        code: ApiErrorCode.INVALID_COVER_IMAGE_REFERENCE
      })
    
    const [validMedia] = await db
      .select({
        id: media.id
      })
      .from(media)
      .where(and(
        eq(media.id, data.data.coverMediaId),
        eq(media.uploadedBy, data.userId),
        isNull(media.momentId),
      ));

    if (!validMedia)
      throw new ForbiddenError("You do not own this media asset.", {
        code: ApiErrorCode.FORBIDDEN_MEDIA_ATTACHMENT_ATTEMPT
      })

    const result = await db.transaction(async tx => {
      const [storedMoment] = await tx.insert(moments).values({
        title: data.data.title,
        visibility: data.data.visibility,
        dateOfMoment: data.data.dateOfMoment,
        description: data.data.description,
        tags: data.data.tags,
        categoryId: data.data.categoryId,
        coverMediaId: data.data.coverMediaId,
        uploadedBy: data.userId,
      }).returning({
        id: moments.id,
        title: moments.title,
      });

      const storedMedia = await tx.update(media).set({
        momentId: storedMoment.id,
        updatedAt: sql`now()`,
      }).where(and(
        inArray(media.id, data.data.mediaIds),
        eq(media.uploadedBy, data.userId),
        isNull(media.momentId),
      )).returning({
        id: media.id,
        secureUrl: media.secureUrl,
      });

      if (storedMedia.length !== data.data.mediaIds.length)
        throw new InternalServerError("Some media could not be attached to this post.");

      return {
        ...storedMoment,
        uploadedMedia: storedMedia
      };
    });

    return result;
  }

  async getMoments(data: GetMomentsInput) {
    const visibilityConditions = [
      or(
        and(
          eq(moments.visibility, MomentVisibility.PRIVATE),
          eq(moments.uploadedBy, data.user.id)
        ),
        ne(moments.visibility, MomentVisibility.PRIVATE),
      ),
      isNull(moments.deletedAt)
    ];

    if (data.user.role !== UserRole.ADMIN) {
      visibilityConditions.push(
        ne(moments.visibility, MomentVisibility.ADMIN_ONLY)
      )
    }

    const joinedRecords = await db
      .select({
        moments: momentsSelect,
        media: mediaSelect,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
      })
      .from(moments)
      .where(and(...visibilityConditions))
      .leftJoin(media, and(
        eq(media.momentId, moments.id),
        isNull(media.deletedAt),
      ))
      .leftJoin(categories, and(
        eq(categories.id, moments.categoryId)
      ))
      .orderBy(desc(moments.dateOfMoment));

    const groupedMoments = new Map();

    for (const record of joinedRecords) {
      const existing = groupedMoments.get(record.moments.id);

      if (!existing) {
        groupedMoments.set(record.moments.id, {
          ...record.moments,
          category: record.category,
          media: record.media? [record.media]: [],
        });

        continue;
      }

      if (record.media) {
        existing.media.push(record.media);
      }

      // We don't bother checking categories since it is a one category to many moments relationship
    }

    return Array.from(groupedMoments.values());
  }

  async updateMoments() {
    
  }
}

export const momentsService = new MomentsService();