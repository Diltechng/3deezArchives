import { AccessTokenPayload, InvitationJwtPayloadInput } from "@/shared/schemas";
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

export type InvitationReqContext<TParams> = {
  invite: InvitationJwtPayloadInput;
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

export type SerializeDates<T> =
  T extends Date ? string :
  T extends Array<infer U> ? SerializeDates<U>[] :
  T extends object ? { [K in keyof T]: SerializeDates<T[K]> } :
  T;