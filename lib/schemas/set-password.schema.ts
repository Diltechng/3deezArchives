import z from "zod";
import { PasswordSchema, UserIdSChema } from "./shared";

export const SetPasswordSchema = z.object({
  userId: UserIdSChema,
  password: PasswordSchema
});

export type SetPasswordInput = z.infer<typeof SetPasswordSchema>
