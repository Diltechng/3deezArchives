import { AccessTokenPayload } from "@/shared/schemas";
import { NextResponse } from "next/server";
import { ApiErrorCode } from "@/lib/errors";
import { Pagination } from "./pagination";

export type ApiResponse =
  | NextResponse
  | Promise<NextResponse>

export interface RouteContext<TParams> {
  params: TParams;
}

export type AuthReqContext<TParams> = {
  user: AccessTokenPayload;
} & RouteContext<TParams>;

export type ResponseData<Data = unknown, Meta extends object = {}> = {
  success: boolean;
  message: string;
  data?: Data;
  error?: {
    message: string;
    code: ApiErrorCode;
    details?: any;
  };
  meta?: Meta;
};