import { PostVisibilityValues } from "@/shared/constants/enums";
import z from "zod";

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