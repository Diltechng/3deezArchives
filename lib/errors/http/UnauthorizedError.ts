import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class UnauthorizedError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 401,
      code: options?.code,
      details: options?.details
    });
  }
}