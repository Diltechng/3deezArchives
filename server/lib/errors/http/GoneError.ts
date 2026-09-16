import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class GoneError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 410,
      code: options?.code,
      details: options?.details
    });
  }
}