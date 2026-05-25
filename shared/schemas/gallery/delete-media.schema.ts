import z from "zod";
import { MediaIdSchema } from "../shared";

export const DeleteMediaSchema = z.object({
  mediaIds: MediaIdSchema.array().min(1, "Must provide at least one media id"),
});

export type DeleteMediaInput = z.infer<typeof DeleteMediaSchema>;