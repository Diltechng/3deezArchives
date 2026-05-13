import { authService } from "@/modules/auth";
import { validateSignUp } from "@/modules/auth";
import { NextRequest, NextResponse } from "next/server";
import { mailService } from "@/modules/mailing";
import { handleError } from "@/lib/api/error-handler";

export const POST = handleError(async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateSignUp(body);

  const registered = await authService.registerUser(validatedData);

  await mailService.sendVerificationEmail({
    email: validatedData.email,
    token: registered.token
  });

  return NextResponse.json({
    success: true,
    message: "User registered succuessfully",
    data: {
      userId: registered.userId
    }
  });
})