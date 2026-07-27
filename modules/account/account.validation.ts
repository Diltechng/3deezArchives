import { BadRequestError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { UpdateFullNameSchema, UpdatePasswordSchema } from "@/shared/schemas/account/update.schema";
import z from "zod";

export function validateUpdateFullName(data: unknown) {
  const result = UpdateFullNameSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid update full name data", {
      code: ApiErrorCode.INVALID_ACCOUNT_UPDATE_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateUpdatePassword(data: unknown) {
  const result = UpdatePasswordSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new BadRequestError("Invalid update password data", {
      code: ApiErrorCode.INVALID_ACCOUNT_UPDATE_DATA,
      details: flattenedError
    });
  }

  return result.data;
}
