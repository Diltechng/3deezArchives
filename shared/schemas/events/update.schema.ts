import z from "zod";
import { CoverMediaIdSchema } from "../media";
import { CategoryIdSchema } from "../categories";
import { EventDateOfMomentSchema, EventDescriptionSchema, EventTagsSchema, EventTitleSchema, EventVisibilitySchema } from "./fields.schema";

export const UpdateEventSchema = z.object({
  title: EventTitleSchema.optional(),
  description: EventDescriptionSchema.optional(),
  tags: EventTagsSchema.optional(),
  visibility: EventVisibilitySchema.optional(),
  dateOfMoment: EventDateOfMomentSchema.optional(),
  categoryId: CategoryIdSchema.optional(),
  media: z.object({
    coverId: CoverMediaIdSchema.optional()
  }),
});

export type UpdateEventPayload = z.infer<typeof UpdateEventSchema>;