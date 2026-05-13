import { handleError, ResponseData } from "@/lib/api/error-handler";
import { authService, tokenService, validateSignIn } from "@/modules/auth";
import { days } from "@/utils/time";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = handleError(async req => {
  const body = await req.json();

  const validatedData = validateSignIn(body);

  const { userId } = await authService.authenticate(validatedData);

  const refreshToken = await tokenService.createSession(userId);

  const accessToken = tokenService.signJwt({ userId });

  (await cookies()).set("refresh_token", refreshToken, {
    maxAge: days(7),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/refresh"
  });

  return NextResponse.json<ResponseData>({
    success: true,
    message: "You have been signed in successfully",
    data: { accessToken }
  });
});