import z from "zod";
import { ValidationError } from "../errors";


interface VerifyEmailInput {
  token: string;
}

export const validateVerifyEmailInput = (data: VerifyEmailInput) => {
  const verifyEmailInputSchema = z.object({
    token: z.string("Please enter a valid token").trim().max(255, "Token is too long")
  });

  const validated = verifyEmailInputSchema.safeParse(data);

  if (!validated.success) {
      const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid or malformed verification credentials", {
      details: flattenedError
    });
  }

  return validated.data;
}