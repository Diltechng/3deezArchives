import z from "zod";
import { PasswordSchema, InvitationIdSchema } from "./shared";

export const SetPasswordSchema = z.object({
  invitationId: InvitationIdSchema,
  password: PasswordSchema
});

export type SetPasswordInput = z.infer<typeof SetPasswordSchema>
