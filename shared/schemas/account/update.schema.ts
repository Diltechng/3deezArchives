import z from "zod";
import { EmailSchema, NameSchema, PasswordSchema } from "../users";


export const UpdateFullNameSchema = z.object({
  name: NameSchema,
});
export type UpdateFullNameInput = z.infer<typeof UpdateFullNameSchema>;


export const UpdateEmailSchema = z.object({
  email: EmailSchema,
});
export type UpdateEmailInput = z.infer<typeof UpdateEmailSchema>;


export const UpdatePasswordSchema = z.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
});
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;