import z from "zod";
import { DateFilterSchema, LimitSchema, PageSchema, SearchSchema } from "../query";
import { InvitationStatusSchema } from "./fields.schema";
import { RoleSchema } from "../users";

export const GetInvitationsQuerySchema = z.object({
  page: PageSchema,
  limit: LimitSchema,
  search: SearchSchema,
  date: DateFilterSchema,
  status: InvitationStatusSchema.optional(),
  role: RoleSchema.optional(),
  sortBy: z.enum(["latest", "oldest"]).default("latest").optional(),
});

export type GetInvitationsQueryInput = z.infer<typeof GetInvitationsQuerySchema>;