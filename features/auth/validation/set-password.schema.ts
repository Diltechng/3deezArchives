import { ValidationError } from "@/features/errors";
import z from "zod";

const setPasswordInputSchema = z.object({
  userId: z.uuid("Please enter a valid ID").trim().max(255, "ID is too long"),
  email: z.email("Please enter a valid email"),
  password: z.string("Please enter a valid password")
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .max(255, "Password is too long")
});

export type SetPasswordInput = z.infer<typeof setPasswordInputSchema>

export function validateSetPasswordInput(data: unknown) {
  const validated = setPasswordInputSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid or malformed password data", {
      details: flattenedError
    });
  }

  return validated.data;
}