import z from "zod";
import { ValidationError } from "@/features/errors";


const verifyEmailInputSchema = z.object({
  token: z.string("Please enter a valid token").trim().max(255, "Token is too long"),
  userId: z.uuid("Please enter a valid ID").trim().max(255, "ID is too long")
});

export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;

export const validateVerifyEmailInput = (data: unknown) => {
  const validated = verifyEmailInputSchema.safeParse(data);

  if (!validated.success) {
      const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid or malformed verification credentials", {
      details: flattenedError
    });
  }

  return validated.data;
}