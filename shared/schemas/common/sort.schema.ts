import z from "zod";

export const SortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SortDto = z.infer<typeof SortSchema>;