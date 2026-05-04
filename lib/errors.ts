interface ErrorOptions {
  code?: string;
  details?: any;
}

interface AppErrorOptions extends ErrorOptions {
  statusCode: number;
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;
  
  constructor(message: string, options: AppErrorOptions) {
    super(message);

    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
    

    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      statusCode: 400,
      code: options?.code,
      details: options?.details
    });
  }
}