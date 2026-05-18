import z from "zod";
import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { AccessTokenPayloadSchema, SetPasswordSchema, SignUpSchema } from "@/lib/schemas";
import { SignInSchema } from "@/lib/schemas";


export function validateSignIn(data: unknown) {
  const validated = SignInSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid sign in data", {
      code: ApiErrorCode.INVALID_SIGNIN_DATA,
      details: flattenedError
    });
  }

  return validated.data;
}

export function validateSignUp(data: unknown) {
  const validated = SignUpSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid sign up data", {
      code: ApiErrorCode.INVALID_SIGNUP_DATA,
      details: flattenedError
    });
  }

  return validated.data;
}

export function validateSetPassword(data: unknown) {
  const validated = SetPasswordSchema.safeParse(data);

  if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid or malformed password data", {
      details: flattenedError
    });
  }

  return validated.data;
}

export function validateAccessTokenPayload(data: unknown) {
  const validated = AccessTokenPayloadSchema.safeParse(data);

    if (!validated.success) {
    const flattenedError = z.flattenError(validated.error).fieldErrors;

    throw new ValidationError("Invalid or malformed access token", {
      code: ApiErrorCode.INVALID_ACCESS_TOKEN,
      details: flattenedError
    });
  }

  return validated.data;
}