export interface ErrorOptions {
  code?: string;
  details?: any;
}

export interface ApiErrorOptions extends ErrorOptions {
  statusCode: number;
}