import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { InviteUserSchema } from "@/lib/schemas";
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