import { ApiErrorOptions } from "../types";

export class ApiError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;
  
  constructor(message: string, options: ApiErrorOptions) {
    super(message);

    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
    

    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}