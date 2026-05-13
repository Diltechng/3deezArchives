import { handleError } from "@/lib/api/error-handler";
import { authService, tokenService, validateSetPassword } from "@/modules/auth";
import { days } from "@/utils/time";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = handleError(async (req: NextRequest) => {
  const body = await req.json();

  const validatedData = validateSetPassword(body);

  await authService.setPassword(validatedData);

  const refresToken = await tokenService.createSession(validatedData.userId);

  const accessToken = tokenService.signJwt({ userId: validatedData.userId });

  (await cookies()).set("refresh_token", refresToken, {
    maxAge: days(7),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/refresh"
  });

  return NextResponse.json({
    success: true,
    message: "Password set successfully",
    data: { accessToken }
  });
})