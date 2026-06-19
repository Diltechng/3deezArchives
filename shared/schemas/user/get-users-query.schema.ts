import z from "zod";
import { DateFilterSchema, LimitSchema, PageSchema, SearchSchema } from "../shared/filters";
import { UserRoleValues, UserStatusValues } from "@/shared/constants/enums";
import { RoleSchema, UserStatusSchema } from "../shared";

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