import z from "zod";
import { MomentVisibilityValues } from "../constants/enums";
import { MediaIdSchema } from "./shared";

export const CreateMomentSchema = z.object({
  title: z.string("Please enter a valid title.")
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(255, "Title is too long."),
  
  description: z.string("Please enter a valid title.")
    .trim()
    .max(500, "Desciption is too long.").optional(),

  tags: z.string("Please enter a valid tag.").trim().array(),
  coverMediaId: MediaIdSchema,
  mediaIds: MediaIdSchema.array().min(1, "At least one media must be attached to this post."),
  visibility: z.enum(MomentVisibilityValues),
  dateOfMoment: z.coerce.date("Please enter a valid date."),
  categoryId: z.uuid("Please enter a valid category ID.")
});

export type CreateMomentInput = z.infer<typeof CreateMomentSchema>;