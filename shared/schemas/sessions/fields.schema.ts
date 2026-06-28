import z from "zod";

export const RefreshTokenSchema = z.string().trim().startsWith("rt-v1_");
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;