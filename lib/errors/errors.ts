import { ApiErrorCode, ConflictError } from ".";

export function AccountAlreadyExistsError() {
  return new ConflictError("An account with this email already exists", {
    code: ApiErrorCode.EMAIL_ALREADY_EXISTS
  });
}