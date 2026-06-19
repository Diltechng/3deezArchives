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

export type ResponseData<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    message: string;
    code: ApiErrorCode;
    details?: any;
  }
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  meta?: Record<string, unknown>;
};