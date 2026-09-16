import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class NotFoundError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 404,
      code: options?.code,
      details: options?.details
    });
  }
}