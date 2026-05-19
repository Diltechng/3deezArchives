import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { MediaIdSchema } from "@/lib/schemas";
import { UploadMediaSchema } from "@/lib/schemas/upload-media.schema";
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

export function validateGetOneMedia(data: unknown) {
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