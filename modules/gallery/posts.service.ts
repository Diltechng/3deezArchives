import { db } from "@/db";
import { categories, media, posts } from "@/db/schema";
import { ApiErrorCode, BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "@/lib/errors";
import { PostVisibility, UserRole } from "@/shared/constants/enums";
import { and, asc, desc, eq, gte, ilike, inArray, isNull, lte, ne, or, sql } from "drizzle-orm";
import { softDelete } from "../shared/helpers/soft-delete";
import { CreateNewPostInput, DeleteOnePostInput, GetOnePostInput, GetPostsInput, GetPostsOutput, UpdateOnePostInput } from "./types";

class PostsService {
  async createNewPost(data: CreateNewPostInput) {
    if (!data.data.media.ids.includes(data.data.media.coverId))
      throw new ForbiddenError("Cover image must exist in attached media.", {
        code: ApiErrorCode.INVALID_COVER_IMAGE_REFERENCE
      })
    
    const [validMedia] = await db
      .select({ id: media.id })
      .from(media)
      .where(and(
        eq(media.id, data.data.media.coverId),
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
        coverMediaId: data.data.media.coverId,
        uploadedBy: data.userId,
      }).returning({
        id: posts.id,
        title: posts.title,
      });

      const storedMedia = await tx.update(media).set({
        postId: storedPost.id,
      }).where(and(
        inArray(media.id, data.data.media.ids),
        eq(media.uploadedBy, data.userId),
        isNull(media.postId),
      )).returning({
        id: media.id,
        secureUrl: media.secureUrl,
      });

      if (storedMedia.length !== data.data.media.ids.length)
        throw new InternalServerError("Some media could not be attached to this post.");

      return {
        ...storedPost,
        uploadedMedia: storedMedia
      };
    });

    return result;
  }

  async getPosts(data: GetPostsInput): Promise<GetPostsOutput> {
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

    const filters = [...visibilityConditions];

    const { limit, page, search, visibility, categorySlug, date, sortBy } = data.filters;
    if (search) {
      filters.push(or(
        ilike(posts.title, `%${search}%`),
        ilike(posts.description, `%${search}%`)
      ));
    }

    if (visibility) {
      filters.push(eq(posts.visibility, visibility));
    }

    if (date.from) {
      filters.push(gte(posts.dateOfMoment, date.from));
    }

    if (date.to) {
      filters.push(lte(posts.dateOfMoment, date.to));
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

      filters.push(eq(posts.categoryId, category.id));
    }

    const orderCriteria = sortBy === "oldest"
      ? [asc(posts.dateOfMoment), asc(posts.id)]
      : [desc(posts.dateOfMoment), desc(posts.id)];

    const offset = (page - 1) * limit;

    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(and(...filters));

    const result = await db.query.posts.findMany({
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
          }
        },
        uploadedByUser: {
          columns: {
            id: true,
            name: true,
            role: true,
          }
        },
      },
    });

    return {
      posts: result,
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

  async getOnePost(data: GetOnePostInput) {
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

    const result = await db.query.posts.findFirst({
      where: and(eq(posts.id, data.postId), ...visibilityConditions),
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
      throw new NotFoundError("Post does not exist or is not accessible to you.", {
        code: ApiErrorCode.POST_NOT_FOUND
      });
    }

    return result;
  }

  async updateOnePost(data: UpdateOnePostInput) {
    if (data.data.media.coverId) {
      const attachmentConditions = [
        eq(media.id, data.data.media.coverId),
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
      coverMediaId: data.data.media.coverId,
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