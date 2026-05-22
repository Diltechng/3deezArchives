import { db } from "@/db";
import { categories, media, posts } from "@/db/schema";
import { ApiErrorCode, ForbiddenError, InternalServerError } from "@/lib/errors";
import { PostVisibility, UserRole } from "@/shared/constants/enums";
import { CreatePostInput } from "@/shared/schemas";
import { and, desc, eq, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { mediaSelect } from "./media.service";

interface CreateNewPostInput {
  data: CreatePostInput;
  userId: string;
}

interface GetPostsInput {
  user: {
    id: string;
    role: string;
  };
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

class PostsService {
  async createNewPost(data: CreateNewPostInput) {
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
        isNull(media.postId),
      ));

    if (!validMedia)
      throw new ForbiddenError("You do not own this media asset.", {
        code: ApiErrorCode.FORBIDDEN_MEDIA_ATTACHMENT_ATTEMPT
      })

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

  async updatePosts() {
    
  }
}

export const postsService = new PostsService();