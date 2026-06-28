import z from "zod";
import { DateFilterSchema, LimitSchema, PageSchema, SearchSchema } from "../query";
import { RoleSchema, UserStatusSchema } from ".";

export const GetUsersQuerySchema = z.object({
  page: PageSchema,
  limit: LimitSchema,
  search: SearchSchema,
  date: DateFilterSchema,
  status: UserStatusSchema.optional(),
  role: RoleSchema.optional(),
  sortBy: z.enum(["latest", "oldest"]).default("latest").optional(),
});

export type GetUsersQueryInput = z.infer<typeof GetUsersQuerySchema>;