import { UserRoleValues } from "@/shared/constants/enums";
import z from "zod";

export const UserIdSchema = z.uuid("Please enter a valid user ID").trim();
export type UserIdInput = z.infer<typeof UserIdSchema>;


export const EmailSchema = z.email("Please enter a valid email");
export type EmailInput = z.infer<typeof EmailSchema>;


export const RoleSchema = z.enum(UserRoleValues);
export type RoleInput = z.infer<typeof RoleSchema>;


export const PasswordSchema = z.string("Please enter a valid password")
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(255, "Password is too long");
export type PasswordInput = z.infer<typeof PasswordSchema>;