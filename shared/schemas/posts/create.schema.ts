import z from "zod";
import { CoverMediaIdSchema, MediaIdArraySchema } from "../media";
import { CategoryIdSchema } from "../categories"
import { PostDateOfMomentSchema, PostDescriptionSchema, PostTagsSchema, PostTitleSchema, PostVisibilitySchema } from ".";

export const CreatePostSchema = z.object({
  title: PostTitleSchema,
  description: PostDescriptionSchema,
  visibility: PostVisibilitySchema,
  dateOfMoment: PostDateOfMomentSchema,
  categoryId: CategoryIdSchema,
  tags: PostTagsSchema,
  media: z.object({
    ids: MediaIdArraySchema,
    coverId: CoverMediaIdSchema
  }),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;