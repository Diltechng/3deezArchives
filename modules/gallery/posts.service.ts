import { db } from "@/db";
import { categories, media, posts } from "@/db/schema";
import { ApiErrorCode, BadRequestError, ForbiddenError, InternalServerError, NotFoundError } from "@/lib/errors";
import { PostVisibility, UserRole } from "@/shared/constants/enums";
import { and, desc, eq, inArray, isNull, ne, not, or, sql } from "drizzle-orm";
import { mediaSelect } from "./media.service";
import {
  CreatePostInput as ZodCreatePostInput,
  UpdatePostInput as ZodUpdatePostInput,
} from "@/shared/schemas";
import { softDelete } from "../shared/helpers/soft-delete";

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
    .select({ id: media.id })
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

async function validateUpdateCoverMedia(data: {
  coverMediaId?: string;
  actorId: string;
  postId: string;
}) {
  if (data.coverMediaId) {
    const attachmentConditions = [
      eq(media.id, data.coverMediaId),
      eq(media.uploadedBy, data.actorId),
      isNull(media.deletedAt),
      or(
        isNull(media.postId),
        eq(media.postId, data.postId)
      ),
    ];

    const [validMedia] = await db
    .select({ id: media.id })
    .from(media)
    .where(and(...attachmentConditions));

  if (!validMedia)
    throw new ForbiddenError("You are not allowed to attach this media asset.", {
      code: ApiErrorCode.FORBIDDEN_MEDIA_ATTACHMENT_ATTEMPT
    });
  }
}

async function updatePostRecord(
  executor: typeof db,
  data: ZodUpdatePostInput,
  actor: {
    id: string;
    role: string
  }
) {
  const updateConditions = [
    eq(posts.id, data.id),
    isNull(posts.deletedAt)
  ];

  if (actor.role !== UserRole.ADMIN) {
    updateConditions.push(
      eq(posts.uploadedBy, actor.id)
    )
  }

  const updateData = Object.fromEntries(
    Object.entries({
      title: data.title,
      categoryId: data.categoryId,
      coverMediaId: data.coverMediaId,
      dateOfMoment: data.dateOfMoment,
      description: data.description,
      tags: data.tags,
      visibility: data.visibility,
      updatedAt: sql`now()`
    }).filter(([_, value]) => value !== undefined)
  );

  const [updatedPost] = await executor.update(posts)
    .set(updateData)
    .where(and(...updateConditions))
    .returning({
      id: posts.id,
      coverMediaId: posts.coverMediaId
    });
  
  if (!updatedPost) {
    throw new NotFoundError("Could not update this post because it is not found", {
      code: ApiErrorCode.POST_NOT_FOUND,
    })
  }

  return updatedPost;
};

async function updateAttachedPostMedia(
  executor: typeof db,
  data: {
    actorId: string;
    postId: string;
    coverMediaId?: string;
    mediaIds?: string[];
    existingPost: {
      id: string;
      coverMediaId?: string | null;
    }
  }
) {
  if (!data.mediaIds?.length) return;

  if (
    data.coverMediaId &&
    !data.mediaIds.includes(data.coverMediaId)
  ) {
    throw new BadRequestError("The cover ")
  }

  const deleteAttachedMediaConditions = [
    eq(media.postId, data.postId),
    not(inArray(media.id, data.mediaIds)),
    eq(media.uploadedBy, data.postId),
  ];

  const updateAttachedMediaConditions = [
    inArray(media.id, data.mediaIds),
    eq(media.uploadedBy, data.actorId),
    isNull(media.deletedAt),
    or(
      isNull(media.postId),
      eq(media.postId, data.postId)
    )
  ];

  await softDelete(executor, media, {
    actorId: data.actorId,
    where: and(...deleteAttachedMediaConditions)
  });

  return await executor.update(media).set({
    postId: data.existingPost.id,
    updatedAt: sql`now()`,
  }).where(and(...updateAttachedMediaConditions)).returning({
    id: media.id,
    secureUrl: media.secureUrl,
  });
}

class PostsService {
  async createNewPost(data: CreateNewPostInput) {
    if (!data.data.mediaIds.includes(data.data.coverMediaId))
      throw new ForbiddenError("Cover image must exist in attached media.", {
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
    await validateUpdateCoverMedia({
      actorId: data.user.id,
      postId: data.data.id,
      coverMediaId: data.data.coverMediaId
    });

    return await db.transaction(async tx => {
      const updatedPost = await updatePostRecord(tx, data.data, data.user);

      const storedMedia = updateAttachedPostMedia(tx, {
        actorId: data.user.id,
        postId: data.data.id,
        existingPost: updatedPost,
        mediaIds: data.data.mediaIds,
        coverMediaId: data.data.coverMediaId,
      });
      

      return {
        ...updatedPost,
        uploadedMedia: storedMedia || []
      };
    })
  }
}

export const postsService = new PostsService();