import { ValidationError } from "@/lib/errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { DeleteMediaSchema, MediaIdSchema } from "@/shared/schemas";
import { UploadMediaSchema } from "@/shared/schemas";
import z from "zod";

export function validateUploadMedia(data: unknown) {
  const result = UploadMediaSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed file", {
      code: ApiErrorCode.INVALID_FILE,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateMediaId(data: unknown) {
  const result = MediaIdSchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).formErrors;
    
    throw new ValidationError("Invalid media ID", {
      code: ApiErrorCode.INVALID_MEDIA_ID,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateDeleteMedia(data: unknown) {
  const result = DeleteMediaSchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;
    
    throw new ValidationError("Invalid delete media data", {
      code: ApiErrorCode.INVALID_DELETE_MEDIA_DATA,
      details: flattenedError
    });
  }

  return result.data;
}