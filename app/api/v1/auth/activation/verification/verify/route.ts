import { validateVerifyEmail } from "@/modules/mailing";
import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/modules/auth";
import { withErrorHandler } from "@/lib/api/error-handler";


export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateVerifyEmail(body);

  await authService.verifyEmail(validatedData);

  return NextResponse.json({
    success: true,
    message: "Email verified succuessfully"
  });
})