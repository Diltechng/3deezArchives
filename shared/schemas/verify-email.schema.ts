import z from "zod";
import { OtpSchema, InvitationTokenSchema } from "./shared";

export const VerifyEmailSchema = z.object({
  otp: OtpSchema,
  invitationToken: InvitationTokenSchema,
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;