import { ApiErrorOptions, ErrorOptions } from "./types";

export * from "./errors";

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

export class ValidationError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 400,
      code: options?.code,
      details: options?.details
    });
  }
}

export class VerificationError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 400,
      code: options?.code,
      details: options?.details
    });
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 400,
      code: options?.code,
      details: options?.details
    });
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 401,
      code: options?.code,
      details: options?.details
    });
  }
}

export class GoneError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 410,
      code: options?.code,
      details: options?.details
    });
  }
}

export class ExpiredError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 410,
      code: options?.code,
      details: options?.details
    });
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 403,
      code: options?.code,
      details: options?.details
    });
  }
}

export class ConflictError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 409,
      code: options?.code,
      details: options?.details
    });
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 404,
      code: options?.code,
      details: options?.details
    });
  }
}

export class InternalServerError extends ApiError {
  constructor(message?: string, options?: ErrorOptions) {
    super(message ?? "Something went wrong", {
      statusCode: 500,
      code: options?.code,
      details: options?.details
    });
  }
}