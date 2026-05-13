import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { RefreshTokenSchema } from "@/lib/schemas";
import z from "zod";

export function validateRefreshToken(data: unknown) {
  const validated = RefreshTokenSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).formErrors;
    
    throw new ValidationError("Invalid refresh token", {
      code: ApiErrorCode.INVALID_REFRESH_TOKEN,
      details: flattenedError
    });
  }

  return validated.data;
}