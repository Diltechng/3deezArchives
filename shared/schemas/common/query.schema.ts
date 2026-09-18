import z from "zod";
import { PaginationQuerySchema } from "./pagination.schema";
import { SortSchema } from "./sort.schema";

export const QuerySchema = PaginationQuerySchema.extend(SortSchema.shape);

export type QueryDto = z.infer<typeof QuerySchema>;