import { NextRequest, NextResponse } from "next/server";
import { ApiError, ApiErrorCode } from "../errors";

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

export function handleError(apiFn: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (req: NextRequest) => {
    try {
      return await apiFn(req);
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