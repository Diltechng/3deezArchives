import z from "zod";

export const RefreshTokenSchema = z.string().trim().startsWith("rt-v1_");
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;


export const UserIdSChema = z.uuid("Please enter a valid ID").trim().max(255, "ID is too long")
export type UserIdInput = z.infer<typeof UserIdSChema>;


export const EmailSchema = z.email("Please enter a valid email");
export type EmailInput = z.infer<typeof EmailSchema>;


export const VerificationTokenSchema = z.string("Please enter a valid token").trim().regex(/^\d{6}$/, {
  error: "Must be exactly 6 digits"
});
export type VerificationTokenInput = z.infer<typeof VerificationTokenSchema>;


export const PasswordSchema = z.string("Please enter a valid password")
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(255, "Password is too long");
export type PasswordInput = z.infer<typeof PasswordSchema>;