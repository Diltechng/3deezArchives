import { validateVerifyEmailInput } from "@/features/mailing";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/features/auth";


export const PATCH = async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateVerifyEmailInput(body);

  await authService.verifyEmail(validatedData);

  await cookies()

  return NextResponse.json({
    success: true,
    message: "Email verified succuessfully"
  });
}