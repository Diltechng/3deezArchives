import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { CreatePostSchema } from "@/shared/schemas";
import z from "zod";

export function validateCreatePost(data: unknown) {
  const result = CreatePostSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed create post data", {
      code: ApiErrorCode.INVALID_CREATE_POST_DATA,
      details: flattenedError
    });
  }

  return result.data;
}