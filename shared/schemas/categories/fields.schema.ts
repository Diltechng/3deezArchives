import z from "zod";

export const CategoryIdSchema = z.uuid("Please enter a valid category ID.");
export type CategoryIdInput = z.infer<typeof CategoryIdSchema>;