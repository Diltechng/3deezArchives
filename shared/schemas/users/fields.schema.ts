import { UserRoleValues, UserStatusValues } from "@/shared/constants/enums";
import z from "zod";

export const UserIdSchema = z.uuid("Please enter a valid user ID").trim();
export type UserIdInput = z.infer<typeof UserIdSchema>;

export const NameSchema = z
  .string()
  .trim()
  .min(3, "Enter your full name")
  .max(100, "Name is too long")
  .refine(
    (name) => name.split(/\s+/).length >= 2,
    "Please enter your first and last name"
  );
export type NameInput = z.infer<typeof NameSchema>;

export const EmailSchema = z.email("Please enter a valid email");
export type EmailInput = z.infer<typeof EmailSchema>;


export const RoleSchema = z.enum(UserRoleValues, "Please enter a valid user role");
export type RoleInput = z.infer<typeof RoleSchema>;

export const UserStatusSchema = z.enum(UserStatusValues, "Please enter a valid user status");
export type UserStatusInput = z.infer<typeof UserStatusSchema>;

export const PasswordSchema = z.string("Please enter a valid password")
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(255, "Password is too long");
export type PasswordInput = z.infer<typeof PasswordSchema>;