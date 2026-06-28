import { BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { RefreshTokenSchema } from "@/shared/schemas";
import z from "zod";

export function validateRefreshToken(data: unknown) {
  const result = RefreshTokenSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).formErrors;
    
    throw new BadRequestError("Invalid refresh token", {
      code: ApiErrorCode.INVALID_REFRESH_TOKEN,
      details: flattenedError
    });
  }

  return result.data;
}