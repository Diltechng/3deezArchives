import { setRefreshTokenCookie } from "@/lib/api/cookies";
import { withErrorHandler } from "@/lib/api/error-handler";
import { sessionService } from "@/modules/sessions/session.service";
import { validateRefreshToken } from "@/modules/sessions/session.validation";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async () => {
  const cookie = (await cookies()).get("refresh_token");
  
  const validatedRefreshToken = validateRefreshToken(cookie?.value);

  const { payload, refreshToken } = await sessionService.verifySession(validatedRefreshToken);
  
  const accessToken = sessionService.signJwt(payload);

  await setRefreshTokenCookie(refreshToken);

  return NextResponse.json({
    success: true,
    message: "Token has been successfully refreshed",
    data: { accessToken }
  });
})