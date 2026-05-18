import z from "zod";
import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { AccessTokenPayloadSchema, SetPasswordSchema, SignUpSchema } from "@/lib/schemas";
import { SignInSchema } from "@/lib/schemas";


export function validateSignIn(data: unknown) {
  const result = SignInSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid sign in data", {
      code: ApiErrorCode.INVALID_SIGNIN_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateSignUp(data: unknown) {
  const result = SignUpSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid sign up data", {
      code: ApiErrorCode.INVALID_SIGNUP_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateSetPassword(data: unknown) {
  const result = SetPasswordSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed password data", {
      details: flattenedError
    });
  }

  return result.data;
}

export function validateAccessTokenPayload(data: unknown) {
  const result = AccessTokenPayloadSchema.safeParse(data);

    if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed access token", {
      code: ApiErrorCode.INVALID_ACCESS_TOKEN,
      details: flattenedError
    });
  }

  return result.data;
}