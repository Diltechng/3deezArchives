import z from "zod";
import { CoverMediaIdSchema, MediaIdArraySchema } from "../media";
import { CategoryIdSchema } from "../categories"
import { EventDateOfMomentSchema, EventDescriptionSchema, EventTagsSchema, EventTitleSchema, EventVisibilitySchema } from ".";

export const CreateEventSchema = z.object({
  title: EventTitleSchema,
  description: EventDescriptionSchema,
  visibility: EventVisibilitySchema,
  dateOfMoment: EventDateOfMomentSchema,
  categoryId: CategoryIdSchema,
  tags: EventTagsSchema,
  media: z.object({
    ids: MediaIdArraySchema,
    coverId: CoverMediaIdSchema
  }),
});

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;