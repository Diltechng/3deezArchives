import { ConflictError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";

export function AccountAlreadyExistsError() {
  return new ConflictError("An account with this email already exists", {
    code: ApiErrorCode.EMAIL_ALREADY_EXISTS
  });
}