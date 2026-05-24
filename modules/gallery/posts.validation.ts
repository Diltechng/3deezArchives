import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { CreatePostSchema, PostIdSchema, UpdatePostSchema } from "@/shared/schemas";
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

export function validatePostId(data: unknown) {
  const result = PostIdSchema.safeParse(data);
  
  if (!result.success) {
    const flattenedError = z.flattenError(result.error).formErrors;
    
    throw new ValidationError("Invalid post ID", {
      code: ApiErrorCode.INVALID_POST_ID,
      details: flattenedError
    });
  }

  return result.data;
}

export function validateUpdatePost(data: unknown) {
  const result = UpdatePostSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed update post data", {
      code: ApiErrorCode.INVALID_UPDATE_POST_DATA,
      details: flattenedError
    });
  }

  return result.data;
}