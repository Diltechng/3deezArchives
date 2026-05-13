import z from "zod";
import { UserIdSChema, VerificationTokenSchema } from "./shared";

export const VerifyEmailSchema = z.object({
  token: VerificationTokenSchema,
  userId: UserIdSChema,
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;