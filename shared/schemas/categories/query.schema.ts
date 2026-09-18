import z from "zod";
import { DateFilterV2Schema, SortSchema } from "../common";

export const GetCategoriesQuerySchema = SortSchema
  .extend(DateFilterV2Schema.shape)
  .extend({
    search: z.string().optional(),
    sortBy: z.enum(["name", "createdAt"]).default("createdAt")
  });

export type GetCategoriesQuery = z.infer<typeof GetCategoriesQuerySchema>;