import z from "zod";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number("Limit must be a valid number.")
    .int("Page must be a valid integer.")
    .positive("Page must be a positive integer.")
    .default(1),

  limit: z.coerce.number("Limit must be a valid number.")
    .int("Limit must be a valid integer.")
    .positive("Limit must be a positive integer.")
    .max(50, "Limit must not exceed 50.")
    .default(10),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;