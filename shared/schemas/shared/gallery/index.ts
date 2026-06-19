import { PostVisibilityValues } from "@/shared/constants/enums";
import z from "zod";

export const CategoryIdSchema = z.uuid("Please enter a valid category ID.");
export type CategoryIdInput = z.infer<typeof CategoryIdSchema>;


export const MediaIdSchema = z.uuid("Please enter a valid media ID").trim();
export type MediaIdInput = z.infer<typeof MediaIdSchema>;


export const MediaIdArraySchema = MediaIdSchema
  .array()
  .min(1, "At least one media must be attached to this post.")
  .refine(arr => new Set(arr).size === arr.length, {
    error: "Duplicate media IDs are not allowed."
  });
export type MediaIdArrayInput = z.infer<typeof MediaIdArraySchema>;


export const PostIdSchema = z.uuid("Please enter a valid post ID").trim();
export type PostIdInput = z.infer<typeof PostIdSchema>;


export const PostTitleSchema = z.string("Please enter a valid title.")
  .trim()
  .min(3, "Title must be at least 3 characters long.")
  .max(255, "Title is too long.");
export type PostTitleInput = z.infer<typeof PostTitleSchema>;


export const PostDescriptionSchema = z.string("Please enter a valid title.")
  .trim()
  .max(500, "Desciption is too long.").optional();
export type PostDescriptionInput = z.infer<typeof PostDescriptionSchema>;


export const PostTagsSchema = z.string("Please enter a valid tag.").trim().array();
export type PostTagsInput = z.infer<typeof PostTagsSchema>;


export const PostVisibilitySchema = z.enum(PostVisibilityValues, "Please enter a valid visibility status");
export type PostVisibilityInput = z.infer<typeof PostVisibilitySchema>;


export const PostDateOfMomentSchema = z.coerce.date("Please enter a valid date.");
export type PostDateOfMomentInput = z.infer<typeof PostDateOfMomentSchema>;