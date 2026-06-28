import z from "zod";

export const MediaIdSchema = z.uuid("Please enter a valid media ID").trim();
export type MediaIdInput = z.infer<typeof MediaIdSchema>;

export const CoverMediaIdSchema = z.uuid("Please attach a valid cover media").trim();
export type CoverMediaIdInput = z.infer<typeof CoverMediaIdSchema>

export const MediaIdArraySchema = MediaIdSchema
  .array()
  .min(1, "At least one media must be attached to this post.")
  .refine(arr => new Set(arr).size === arr.length, {
    error: "Duplicate media IDs are not allowed."
  });
export type MediaIdArrayInput = z.infer<typeof MediaIdArraySchema>;