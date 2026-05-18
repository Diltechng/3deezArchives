import { ApiErrorCode, ValidationError } from "@/lib/errors";
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