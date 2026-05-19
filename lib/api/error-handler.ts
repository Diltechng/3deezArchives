import { NextRequest, NextResponse } from "next/server";
import { ApiError, ApiErrorCode } from "../errors";
import { ApiResponse, RouteContext } from "./types";

export type ResponseData = {
  success: boolean;
  message: string;
  data?: any;
  error?: {
    message: string;
    code: ApiErrorCode;
    details?: any;
  }
};

export function withErrorHandler<TParams>(handler: (req: NextRequest, context: RouteContext<TParams>) => ApiResponse) {
  return async (req: NextRequest, context: RouteContext<TParams>) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error(error);
      if (error instanceof ApiError) {
        return NextResponse.json({
          success: false,
          error: {
            message: error.message,
            code: error.code
          }
        }, { status: error.statusCode });
      }

      return NextResponse.json({
        success: false,
        error: {
          message: "Somthing went wrong",
          code: "INTERNAL_SERVER_ERROR"
        }
      }, { status: 500 });
    }
  }
}