import z from "zod";
import { CategoryIdSchema, MediaIdArraySchema, MediaIdSchema, PostDateOfMomentSchema, PostDescriptionSchema, PostIdSchema, PostTagsSchema, PostTitleSchema, PostVisibilitySchema } from "../shared";

export const UpdatePostSchema = z.object({
  id: PostIdSchema,
  title: PostTitleSchema.optional(),
  description: PostDescriptionSchema.optional(),
  tags: PostTagsSchema.optional(),
  coverMediaId: MediaIdSchema.optional(),
  mediaIds: MediaIdArraySchema.optional(),
  visibility: PostVisibilitySchema.optional(),
  dateOfMoment: PostDateOfMomentSchema.optional(),
  categoryId: CategoryIdSchema.optional(),
});

export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;