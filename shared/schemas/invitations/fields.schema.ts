import z from "zod";

export const InvitationIdSchema = z.uuid("Please enter a valid invitation ID").trim();
export type InvitationIdInput = z.infer<typeof InvitationIdSchema>;


export const InvitationTokenSchema = z.string("Please enter a valid token").trim();
export type InvitationTokenInput = z.infer<typeof InvitationTokenSchema>;

export const OtpSchema = z.string("Please enter a valid otp").trim().regex(/^\d{6}$/, {
  error: "Must be exactly 6 digits"
});
export type OtpInput = z.infer<typeof OtpSchema>;