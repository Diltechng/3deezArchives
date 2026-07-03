import { ConflictError, NotFoundError } from ".";
import { ApiErrorCode } from "@/shared/errors/error-codes";

export function AccountAlreadyExistsError() {
  return new ConflictError("An account with this email already exists", {
    code: ApiErrorCode.EMAIL_ALREADY_EXISTS
  });
}

export function MediaNotFoundError() {
   return new NotFoundError("Media not found", {
    code: ApiErrorCode.MEDIA_NOT_FOUND
  });
}