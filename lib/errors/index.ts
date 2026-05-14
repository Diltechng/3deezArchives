interface ErrorOptions {
  code?: string;
  details?: any;
}

interface ApiErrorOptions extends ErrorOptions {
  statusCode: number;
}

export enum ApiErrorCode {
  INVALID_VERIFICATION_SESSION = "INVALID_VERIFICATION_SESSION",
  INVALID_VERIFICATION_TOKEN = "INVALID_VERIFICATION_TOKEN",
  INVALID_SIGNUP_SESSION = "INVALID_SIGNUP_SESSION",
  INVALID_SIGNUP_DATA = "INVALID_SIGNUP_DATA",
  INVALID_SIGNIN_DATA = "INVALID_SIGNIN_DATA",
  INVALID_VERIFICATION_DATA = "INVALID_VERIFICATION_DATA",
  INVALID_TOKEN_RESEND_DATA = "INVALID_TOKEN_RESEND_DATA",
  INVALID_AUTH_SESSION = "INVALID_AUTH_SESSION",
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
  INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  
  EXPIRED_VERIFICATION_SESSION = "EXPIRED_VERIFICATION_SESSION",
  EXPIRED_AUTH_SESSION = "EXPIRED_AUTH_SESSION",
  
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  PASSWORD_ALREADY_SET = "PASSWORD_ALREADY_SET",
  USER_NOT_FOUND = "USER_NOT_FOUND",
}

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