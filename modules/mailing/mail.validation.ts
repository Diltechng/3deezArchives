import z from "zod";
import { BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { VerifyEmailSchema } from "@/shared/schemas";
import { ResendVerificationSchema } from "@/shared/schemas";

export function validateResendVerification(data: unknown) {
  const result = ResendVerificationSchema.safeParse(data);
  
  if (!result.success) {
      const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid token resend request", {
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

    throw new BadRequestError("Verification data is invalid", {
      code: ApiErrorCode.INVALID_VERIFICATION_DATA,
      details: flattenedError
    });
  }

  return result.data;
}