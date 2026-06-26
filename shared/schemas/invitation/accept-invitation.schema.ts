import z from "zod";
import { PasswordSchema } from "../shared";

export const AcceptInviteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Enter your full name")
    .max(100, "Name is too long")
    .refine(
      (name) => name.split(/\s+/).length >= 2,
      "Please enter your first and last name"
    ),
  password: PasswordSchema,
});

export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>;
