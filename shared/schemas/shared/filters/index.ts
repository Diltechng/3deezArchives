import z from "zod";

export const PageSchema = z.coerce.number("Limit must be a valid number.")
  .int("Page must be a valid integer.")
  .positive("Page must be a positive integer.")
  .default(1);

export const LimitSchema = z.coerce.number("Limit must be a valid number.")
  .int("Limit must be a valid integer.")
  .positive("Limit must be a positive integer.")
  .max(50, "Limit must not exceed 50.")
  .default(10);

export const SearchSchema = z.string("Please enter a valid search query")
  .max(225, "Search query is too long")
  .optional();

export const DateFilterSchema = z.object({
  from: z.iso.date("Please enter a valid date")
    .transform(val => new Date(val))
    .optional(),
  to: z.iso.date("Please enter a valid date")
    .transform(val => new Date(val))
    .optional(),
  });
