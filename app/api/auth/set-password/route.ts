import { authService, tokenService, validateSetPasswordInput } from "@/features/auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateSetPasswordInput(body);

  await authService.setPassword(validatedData);

  tokenService.signJwt({ userId: validatedData.userId });

  return NextResponse.json({
    success: true,
    message: "Password set successfully"
  });
}