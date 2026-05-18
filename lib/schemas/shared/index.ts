import z from "zod";

export const RefreshTokenSchema = z.string().trim().startsWith("rt-v1_");
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;


export const UserIdSchema = z.uuid("Please enter a valid ID").trim().max(255, "ID is too long")
export type UserIdInput = z.infer<typeof UserIdSchema>;


export const InvitationIdSchema = z.uuid("Please enter a valid ID").trim().max(255, "ID is too long")
export type InvitationIdInput = z.infer<typeof UserIdSchema>;


export const EmailSchema = z.email("Please enter a valid email");
export type EmailInput = z.infer<typeof EmailSchema>;


export const RoleSchema = z.enum(["admin", "staff"]);
export type RoleInput = z.infer<typeof RoleSchema>;


export const InvitationTokenSchema = z.string("Please enter a valid token").trim();
export type InvitationTokenInput = z.infer<typeof InvitationTokenSchema>;


export const OtpSchema = z.string("Please enter a valid otp").trim().regex(/^\d{6}$/, {
  error: "Must be exactly 6 digits"
});
export type OtpInput = z.infer<typeof OtpSchema>;


export const PasswordSchema = z.string("Please enter a valid password")
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(255, "Password is too long");
export type PasswordInput = z.infer<typeof PasswordSchema>;