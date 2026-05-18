import z from "zod";
import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { VerifyEmailSchema } from "@/lib/schemas";
import { ResendVerificationSchema } from "@/lib/schemas/resend-verification.schema";

export function validateResendVerification(data: unknown) {
  const result = ResendVerificationSchema.safeParse(data);
  
  if (!result.success) {
      const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid token resend request", {
      code: ApiErrorCode.INVALID_TOKEN_RESEND_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateVerifyEmail(data: unknown) {
  const result = VerifyEmailSchema.safeParse(data);

  if (!result.success) {
      const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Verification data is invalid", {
      code: ApiErrorCode.INVALID_VERIFICATION_DATA,
      details: flattenedError
    });
  }

  return result.data;
}