import z from "zod";
import { BadRequestError } from "../errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";

export function validateRequest<T>(schema: z.ZodType<T>, data: unknown) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new BadRequestError("Invalid or malformed request", {
      code: ApiErrorCode.VALIDATION_ERROR,
      details: result.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }))
    });
  }

  return result.data;
}