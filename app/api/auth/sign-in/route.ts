import { setRefreshTokenCookie } from "@/lib/api/cookies";
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

  await setRefreshTokenCookie(refreshToken);

  return NextResponse.json<ResponseData>({
    success: true,
    message: "You have been signed in successfully",
    data: { accessToken }
  });
});