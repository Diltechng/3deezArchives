import { setRefreshTokenCookie } from "@/lib/api/cookies";
import { handleError } from "@/lib/api/error-handler";
import { tokenService } from "@/modules/auth";
import { validateRefreshToken } from "@/modules/auth/token.validation";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export const POST = handleError(async () => {
  const cookie = (await cookies()).get("refresh_token");
  
  const validatedRefreshToken = validateRefreshToken(cookie?.value);

  const { payload, refreshToken } = await tokenService.verifySession(validatedRefreshToken);
  
  const accessToken = tokenService.signJwt(payload);

  await setRefreshTokenCookie(refreshToken);

  return NextResponse.json({
    success: true,
    message: "Token has been successfully refreshed",
    data: { accessToken }
  });
})