import { NextResponse } from "next/server";

export type ApiResponse =
  | NextResponse
  | Promise<NextResponse>

export interface RouteContext<TParams> {
  params: TParams;
}