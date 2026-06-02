import z from "zod";
import { PostVisibilitySchema } from "../shared";

export const GetPostsQuerySchema = z.object({
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
    
  visibility: PostVisibilitySchema.optional(),
});

export type GetPostsQueryInput = z.infer<typeof GetPostsQuerySchema>;