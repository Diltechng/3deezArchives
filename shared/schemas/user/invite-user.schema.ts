import z from "zod";
import { EmailSchema, RoleSchema } from "../shared";

export const InviteUserSchema = z.object({
  email: EmailSchema,
  role: RoleSchema,
});

export type InviteUserInput = z.infer<typeof InviteUserSchema>;