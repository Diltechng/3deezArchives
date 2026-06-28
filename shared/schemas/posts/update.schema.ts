import z from "zod";
import { CoverMediaIdSchema } from "../media";
import { CategoryIdSchema } from "../categories";
import { PostDateOfMomentSchema, PostDescriptionSchema, PostTagsSchema, PostTitleSchema, PostVisibilitySchema } from ".";

export const UpdatePostSchema = z.object({
  title: PostTitleSchema.optional(),
  description: PostDescriptionSchema.optional(),
  tags: PostTagsSchema.optional(),
  visibility: PostVisibilitySchema.optional(),
  dateOfMoment: PostDateOfMomentSchema.optional(),
  categoryId: CategoryIdSchema.optional(),
  media: z.object({
    coverId: CoverMediaIdSchema.optional()
  }),
});

export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;