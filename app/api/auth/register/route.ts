import { authService } from "@/features/auth";
import { validateRegisterInput } from "@/features/auth";
import { NextRequest, NextResponse } from "next/server";
import { mailService } from "@/features/mailing";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateRegisterInput(body);

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
}