import { setRefreshTokenCookie } from "@/lib/api/cookies";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/lib/api/types";
import { authService, sessionService, validateSignIn } from "@/modules/auth";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async req => {
  const body = await req.json();

  const validatedData = validateSignIn(body);

  const { userId, role } = await authService.authenticate(validatedData);

  const refreshToken = await sessionService.createSession(userId);

  const accessToken = sessionService.signJwt({ userId, role });

  await setRefreshTokenCookie(refreshToken);

  return NextResponse.json<ResponseData>({
    success: true,
    message: "You have been signed in successfully",
    data: { accessToken }
  });
});