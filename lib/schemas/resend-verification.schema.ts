import z from "zod";
import { UserIdSChema } from "./shared";

export const ResendVerificationSchema = z.object({
  userId: UserIdSChema
});

export type ResendVerificationInput = z.infer<typeof ResendVerificationSchema>