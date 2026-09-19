import z from "zod";
import { EventVisibilitySchema } from "./fields.schema";
import { DateFilterV2Schema, PaginationQuerySchema } from "../common";

export const GetEventsQuerySchema = PaginationQuerySchema
  .extend(DateFilterV2Schema.shape)
  .extend({
    search: z.string("Please enter a valid search query")
      .max(225, "Search query is too long")
      .optional(),

    categorySlug: z.string("Please enter a valid category filter")
      .max(225, "Category filter is too long")
      .optional(),

    visibility: EventVisibilitySchema.optional(),
    
    sortBy: z.enum(["latest", "oldest"]).default("latest"),
  });

export type GetEventsQuery = z.infer<typeof GetEventsQuerySchema>;