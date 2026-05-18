import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api/error-handler";
import { withAuthGuard } from "@/lib/api/auth-guard";

export const POST = withErrorHandler(
  withAuthGuard(async (req: NextRequest) => {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      message: "User invited succuessfully",
    });
  }, [])
);