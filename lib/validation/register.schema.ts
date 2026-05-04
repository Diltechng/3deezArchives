import z from "zod";
import { ValidationError } from "../errors";

interface RegisterInput {
  email: string;
  fullName: string;
}


export function validateRegisterInput(data: RegisterInput) {
  const registerInputSchema = z.object({
    email: z.email("Please enter a valid email"),
    fullName: z.string("Please enter a valid name")
      .min(6, "Full name must be at least 6 characters long")
      .max(255, "Full name is too long")
  });

  const validated = registerInputSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Validation Error", {
      details: flattenedError
    });
  }

  return validated.data;
}