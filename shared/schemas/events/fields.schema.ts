import { PostVisibilityValues } from "@/shared/constants/enums";
import z from "zod";

export const EventIdSchema = z.uuid("Please enter a valid event ID").trim();
export type EventId = z.infer<typeof EventIdSchema>;


export const EventTitleSchema = z.string("Please enter a valid title.")
  .trim()
  .min(3, "Title must be at least 3 characters long.")
  .max(255, "Title is too long.");
export type EventTitle = z.infer<typeof EventTitleSchema>;


export const EventDescriptionSchema = z.string("Please enter a valid title.")
  .trim()
  .max(500, "Desciption is too long.").optional();
export type EventDescription = z.infer<typeof EventDescriptionSchema>;


export const EventTagsSchema = z.string("Please enter a valid tag.").trim().array();
export type EventTags = z.infer<typeof EventTagsSchema>;


export const EventVisibilitySchema = z.enum(PostVisibilityValues, "Please enter a valid visibility status");
export type EventVisibility = z.infer<typeof EventVisibilitySchema>;


export const EventDateOfMomentSchema = z.coerce.date("Please enter a valid date.");
export type EventDateOfMoment = z.infer<typeof EventDateOfMomentSchema>;