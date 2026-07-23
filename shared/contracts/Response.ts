import { ApiErrorCode } from "../errors/error-codes";

export type TResponse<Data = unknown, Meta extends object = {}> = {
  success: boolean;
  message: string;
  data: Data;
  error?: {
    message: string;
    code: ApiErrorCode;
    details?: any;
  };
  meta?: Meta;
};