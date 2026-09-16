import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class BadRequestError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 400,
      code: options?.code,
      details: options?.details
    });
  }
}