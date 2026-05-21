import { ApiErrorCode, ValidationError } from "@/lib/errors";
import { CreateMomentSchema } from "@/shared/schemas/create-moment.schema";
import z from "zod";

export function validateCreateMoment(data: unknown) {
  const result = CreateMomentSchema.safeParse(data);

  if (!result.success) {
    const flattenedError = z.flattenError(result.error).fieldErrors;

    throw new ValidationError("Invalid or malformed create moment data", {
      code: ApiErrorCode.INVALID_CREATE_MOMENT_DATA,
      details: flattenedError
    });
  }

  return result.data;
}