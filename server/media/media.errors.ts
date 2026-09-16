import { NotFoundError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";

export function MediaNotFoundError() {
   return new NotFoundError("Media not found", {
    code: ApiErrorCode.MEDIA_NOT_FOUND
  });
}