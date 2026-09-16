import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class ForbiddenError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 403,
      code: options?.code,
      details: options?.details
    });
  }
}