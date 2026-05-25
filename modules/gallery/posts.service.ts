import { db } from "@/db";
import { categories, media, posts } from "@/db/schema";
import { ApiErrorCode, BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "@/lib/errors";
import { PostVisibility, UserRole } from "@/shared/constants/enums";
import { and, desc, eq, inArray, isNull, ne, not, or, sql } from "drizzle-orm";
import { mediaSelect } from "./media.service";
import { softDelete } from "../shared/helpers/soft-delete";
import { alias } from "drizzle-orm/pg-core";
import { CreateNewPostInput, DeleteOnePostInput, GetPostsInput, UpdateOnePostInput } from "./types";


const postsSelect = {
  id: posts.id,
  title: posts.title,
  description: posts.description,
  visibility: posts.visibility,
  uploadedBy: posts.uploadedBy,
  tags: posts.tags,
  dateOfMoment: posts.dateOfMoment,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
}

class PostsService {
  async createNewPost(data: CreateNewPostInput) {
    if (!data.data.mediaIds.includes(data.data.coverMediaId))
      throw new ForbiddenError("Cover image must exist in attached media.", {
        code: ApiErrorCode.INVALID_COVER_IMAGE_REFERENCE
      })
    
    const [validMedia] = await db
      .select({ id: media.id })
      .from(media)
      .where(and(
        eq(media.id, data.data.coverMediaId),
        eq(media.uploadedBy, data.userId),
        isNull(media.postId),
      ));

    if (!validMedia) {
      throw new ForbiddenError("You do not own this media asset.", {
        code: ApiErrorCode.FORBIDDEN_COVER_MEDIA_SELECTION
      });
    }

    const result = await db.transaction(async tx => {
      const [storedPost] = await tx.insert(posts).values({
        title: data.data.title,
        visibility: data.data.visibility,
        dateOfMoment: data.data.dateOfMoment,
        description: data.data.description,
        tags: data.data.tags,
        categoryId: data.data.categoryId,
        coverMediaId: data.data.coverMediaId,
        uploadedBy: data.userId,
      }).returning({
        id: posts.id,
        title: posts.title,
      });

      const storedMedia = await tx.update(media).set({
        postId: storedPost.id,
      }).where(and(
        inArray(media.id, data.data.mediaIds),
        eq(media.uploadedBy, data.userId),
        isNull(media.postId),
      )).returning({
        id: media.id,
        secureUrl: media.secureUrl,
      });

      if (storedMedia.length !== data.data.mediaIds.length)
        throw new InternalServerError("Some media could not be attached to this post.");

      return {
        ...storedPost,
        uploadedMedia: storedMedia
      };
    });

    return result;
  }

  async getPosts(data: GetPostsInput) {
    const visibilityConditions = [
      or(
        and(
          eq(posts.visibility, PostVisibility.PRIVATE),
          eq(posts.uploadedBy, data.userId)
        ),
        ne(posts.visibility, PostVisibility.PRIVATE),
      ),
      isNull(posts.deletedAt)
    ];

    if (data.userRole !== UserRole.ADMIN) {
      visibilityConditions.push(
        ne(posts.visibility, PostVisibility.ADMIN_ONLY)
      )
    }

    const coverMedia = alias(media, "cover_media");

    const joinedRecords = await db
      .select({
        posts: postsSelect,
        media: mediaSelect,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
        coverMedia: {
          id: coverMedia.id,
          secureUrl: coverMedia.secureUrl,
        }
      })
      .from(posts)
      .where(and(...visibilityConditions))
      .leftJoin(media, and(
        eq(media.postId, posts.id),
        isNull(media.deletedAt),
      ))
      .leftJoin(categories, and(
        eq(categories.id, posts.categoryId)
      ))
      .leftJoin(coverMedia, and(
        eq(coverMedia.id, posts.coverMediaId),
        isNull(coverMedia.deletedAt)
      ))
      .orderBy(desc(posts.dateOfMoment));

    const groupedPosts = new Map();

    for (const record of joinedRecords) {
      const existing = groupedPosts.get(record.posts.id);

      if (!existing) {
        groupedPosts.set(record.posts.id, {
          ...record.posts,
          category: record.category,
          coverMedia: record.coverMedia,
          media: record.media? [record.media]: [],
        });

        continue;
      }

      if (record.media) {
        existing.media.push(record.media);
      }

      // We don't bother checking categories since it is a one category to many posts relationship
    }

    return Array.from(groupedPosts.values());
  }

  async updateOnePost(data: UpdateOnePostInput) {
    if (data.data.coverMediaId) {
      const attachmentConditions = [
        eq(media.id, data.data.coverMediaId),
        eq(media.uploadedBy, data.userId),
        isNull(media.deletedAt),
        eq(media.postId, data.postId),
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
      coverMediaId: data.data.coverMediaId,
      dateOfMoment: data.data.dateOfMoment,
      description: data.data.description,
      tags: data.data.tags,
      visibility: data.data.visibility,
    }).filter(([_, value]) => value !== undefined);

    if (!updateEntries.length) {
      throw new BadRequestError("You must provide at least one field to update", {
        code: ApiErrorCode.INVALID_UPDATE_POST_DATA
      });
    }

    const updateData = Object.fromEntries(updateEntries);

    const updateConditions = [
      eq(posts.id, data.postId),
      isNull(posts.deletedAt)
    ];

    if (data.userRole !== UserRole.ADMIN) {
      updateConditions.push(
        eq(posts.uploadedBy, data.userId)
      )
    }

    const [updatedPost] = await db.update(posts)
      .set({
        ...updateData,
      })
      .where(and(...updateConditions))
      .returning({
        id: posts.id
      });
    
    if (!updatedPost) {
      throw new NotFoundError("Could not update this post because it is not found", {
        code: ApiErrorCode.POST_NOT_FOUND,
      })
    }

    return updatedPost;
  }

  async deleteOnePost(data: DeleteOnePostInput) {
    const deleteConditions = [
      eq(posts.id, data.postId),
    ];

    if (data.userRole !== UserRole.ADMIN) {
      deleteConditions.push(
        eq(posts.uploadedBy, data.userId),
      );
    }

    return await db.transaction(async tx => {
      const [deletedPost] = await softDelete(tx, posts, {
        actorId: data.userId,
        where: and(...deleteConditions)
      }).returning({ id: posts.id });

      if (!deletedPost) {
        throw new ForbiddenError("Invalid post deletion operation.", {
          code: ApiErrorCode.INVALID_DELETE_OPERATION
        })
      }

      const deletedMedia = await softDelete(tx, media, {
        actorId: data.userId,
        where: and(
          eq(media.postId, deletedPost.id)
        )
      }).returning({ id: media.id });

      return {
        ...deletedPost,
        media: deletedMedia
      }
    });
  }
}

export const postsService = new PostsService();