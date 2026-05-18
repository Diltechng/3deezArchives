import { NextResponse } from "next/server";

export type ApiResponse =
  | NextResponse
  | Promise<NextResponse>