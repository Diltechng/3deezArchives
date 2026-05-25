import z from "zod";
import { InvitationTokenSchema } from "../shared";

export const ResendVerificationSchema = z.object({
  invitationToken: InvitationTokenSchema,
});

export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>