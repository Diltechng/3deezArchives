import { AccessTokenPayload } from "@/shared/schemas";
import { NextResponse } from "next/server";
import { ApiErrorCode } from "@/lib/errors";

export type ApiResponse =
  | NextResponse
  | Promise<NextResponse>

export interface RouteContext<TParams> {
  params: TParams;
}

export type AuthReqContext<TParams> = {
  user: AccessTokenPayload;
} & RouteContext<TParams>;

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