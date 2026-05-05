import z from "zod";
import { ValidationError } from "../errors";


const registerInputSchema = z.object({
  email: z.email("Please enter a valid email"),
  fullName: z.string("Please enter a valid name")
    .min(6, "Full name must be at least 6 characters long")
    .max(255, "Full name is too long")
});

export type RegisterInput = z.infer<typeof registerInputSchema>;

export function validateRegisterInput(data: unknown) {
  const validated = registerInputSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid or malformed registration credentials", {
      details: flattenedError
    });
  }

  return validated.data;
}