import { db } from "@/db";
import { categories, media, posts } from "@/db/schema";
import { ApiErrorCode, ForbiddenError, InternalServerError } from "@/lib/errors";
import { PostVisibility, UserRole } from "@/shared/constants/enums";
import { and, desc, eq, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { mediaSelect } from "./media.service";
import {
  CreatePostInput as ZodCreatePostInput,
  UpdatePostInput as ZodUpdatePostInput,
} from "@/shared/schemas";

interface CreateNewPostInput {
  data: ZodCreatePostInput;
  userId: string;
}

interface GetPostsInput {
  user: {
    id: string;
    role: UserRole;
  };
}

interface UpdatePostInput {
  data: ZodUpdatePostInput,
  user: {
    id: string;
    role: string;
  }
}

const postsSelect = {
  id: posts.id,
  title: posts.title,
  description: posts.description,
  visibility: posts.visibility,
  uploadedBy: posts.uploadedBy,
  coverMediaId: posts.coverMediaId,
  tags: posts.tags,
  dateOfMoment: posts.dateOfMoment,
  createdAt: posts.createdAt,
  updatedAt: posts.updatedAt,
}

async function validateMediaOwnership(mediaId: string, userId: string) {
  const [validMedia] = await db
    .select({
      id: media.id
    })
    .from(media)
    .where(and(
      eq(media.id, mediaId),
      eq(media.uploadedBy, userId),
      isNull(media.postId),
    ));

  if (!validMedia)
    throw new ForbiddenError("You do not own this media asset.", {
      code: ApiErrorCode.FORBIDDEN_MEDIA_ATTACHMENT_ATTEMPT
    });
}

class PostsService {
  async createNewPost(data: CreateNewPostInput) {
    if (!data.data.mediaIds.includes(data.data.coverMediaId))
      throw new ForbiddenError("Cover image must belong to attached media.", {
        code: ApiErrorCode.INVALID_COVER_IMAGE_REFERENCE
      })
    
    await validateMediaOwnership(data.data.coverMediaId, data.userId);

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
        updatedAt: sql`now()`,
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
          eq(posts.uploadedBy, data.user.id)
        ),
        ne(posts.visibility, PostVisibility.PRIVATE),
      ),
      isNull(posts.deletedAt)
    ];

    if (data.user.role !== UserRole.ADMIN) {
      visibilityConditions.push(
        ne(posts.visibility, PostVisibility.ADMIN_ONLY)
      )
    }

    const joinedRecords = await db
      .select({
        posts: postsSelect,
        media: mediaSelect,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
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
      .orderBy(desc(posts.dateOfMoment));

    const groupedPosts = new Map();

    for (const record of joinedRecords) {
      const existing = groupedPosts.get(record.posts.id);

      if (!existing) {
        groupedPosts.set(record.posts.id, {
          ...record.posts,
          category: record.category,
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

  async updatePost(data: UpdatePostInput) {
    if (data.data.coverMediaId)
      await validateMediaOwnership(data.data.coverMediaId, data.user.id);

    const updateData = {};
    for (const [key, value] of Object.entries(data.data)) {
      console.log(key, value);
    }

    const visibilityConditions = [
      or(
        and(
          eq(posts.visibility, PostVisibility.PRIVATE),
          eq(posts.uploadedBy, data.user.id)
        ),
        ne(posts.visibility, PostVisibility.PRIVATE),
      ),
      isNull(posts.deletedAt)
    ];

    if (data.user.role !== UserRole.ADMIN) {
      visibilityConditions.push(
        ne(posts.visibility, PostVisibility.ADMIN_ONLY)
      )
    }

    const [updatedPost] = await db.update(posts).set({
      title: data.data.title,
      categoryId: data.data.title,
      coverMediaId: data.data.coverMediaId,
      dateOfMoment: data.data.dateOfMoment,
      description: data.data.description,
      tags: data.data.tags,
      visibility: data.data.visibility,
      updatedAt: sql`now()`
    }).where(and(
      eq(posts.id, data.data.id),
      ...visibilityConditions,
    )).returning({
      id: posts.id
    });
  }
}

export const postsService = new PostsService();