import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class ConflictError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 409,
      code: options?.code,
      details: options?.details
    });
  }
}