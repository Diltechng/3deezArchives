import { ApiError } from "../base/ApiError";
import { ErrorOptions } from "../types";

export class InternalServerError extends ApiError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "Something went wrong", {
      statusCode: 500,
      code: options?.code,
      details: options?.details
    });
  }
}