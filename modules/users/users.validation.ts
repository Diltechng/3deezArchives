import { ValidationError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { InviteUserSchema } from "@/shared/schemas";
import { GetUsersQuerySchema } from "@/shared/schemas/user/get-users-query.schema";
import z from "zod";

export function validateInviteUser(data: unknown) {
  const result = InviteUserSchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid user creation data", {
      code: ApiErrorCode.INVALID_USER_CREATION_DATA,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateGetUsersQuery(data: unknown) {
  const result = GetUsersQuerySchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed get users query", {
      code: ApiErrorCode.INVALID_FETCH_QUERY,
      details: flattenedError
    });
  }

  return result.data;
}