import z from "zod";
import { BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { AccessTokenPayloadSchema } from "@/shared/schemas";
import { SignInSchema } from "@/shared/schemas";


export function validateSignIn(data: unknown) {
  const result = SignInSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid sign in data", {
      code: ApiErrorCode.INVALID_SIGNIN_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateAccessTokenPayload(data: unknown) {
  const result = AccessTokenPayloadSchema.safeParse(data);

    if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid or malformed access token", {
      code: ApiErrorCode.INVALID_ACCESS_TOKEN,
      details: flattenedError
    });
  }

  return result.data;
}