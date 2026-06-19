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

export type ResponseData<Data = unknown, Meta extends object = {}> = {
  success: boolean;
  message: string;
  data?: Data;
  error?: {
    message: string;
    code: ApiErrorCode;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  } & Meta;
};