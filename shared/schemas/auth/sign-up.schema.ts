import z from "zod";
import { EmailSchema } from "../shared";

export const SignUpSchema = z.object({
  email: EmailSchema
});

export type SignUpInput = z.infer<typeof SignUpSchema>;