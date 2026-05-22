import z from "zod";
import { CategoryIdSchema, MediaIdArraySchema, MediaIdSchema, PostDateOfMomentSchema, PostDescriptionSchema, PostTagsSchema, PostTitleSchema, PostVisibilitySchema } from "../shared";

export const CreatePostSchema = z.object({
  title: PostTitleSchema,
  description: PostDescriptionSchema,
  tags: PostTagsSchema,
  coverMediaId: MediaIdSchema,
  mediaIds: MediaIdArraySchema,
  visibility: PostVisibilitySchema,
  dateOfMoment: PostDateOfMomentSchema,
  categoryId: CategoryIdSchema,
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;