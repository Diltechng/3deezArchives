import z from "zod";
import { EventVisibilitySchema } from ".";

export const GetEventsQuerySchema = z.object({
  page: z.coerce.number("Limit must be a valid number.")
    .int("Page must be a valid integer.")
    .positive("Page must be a positive integer.")
    .default(1),

  limit: z.coerce.number("Limit must be a valid number.")
    .int("Limit must be a valid integer.")
    .positive("Limit must be a positive integer.")
    .max(50, "Limit must not exceed 50.")
    .default(10),

  search: z.string("Please enter a valid search query")
    .max(225, "Search query is too long")
    .optional(),

  categorySlug: z.string("Please enter a valid category filter")
    .max(225, "Category filter is too long")
    .optional(),

  date: z.object({
    from: z.iso.date("Please enter a valid date")
      .transform(val => new Date(val))
      .optional(),
    to: z.iso.date("Please enter a valid date")
      .transform(val => new Date(val))
      .optional(),
  }),
  
  sortBy: z.enum(["latest", "oldest"]).default("latest"),
  visibility: EventVisibilitySchema.optional(),
});

export type GetEventsQueryInput = z.infer<typeof GetEventsQuerySchema>;