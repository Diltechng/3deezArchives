import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { sessionService, validateRefreshToken } from "@/modules/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const DELETE = withErrorHandler(async () => {
  const cookieStore = await cookies();
  
  const cookie = cookieStore.get("refresh_token");
    
  const validatedRefreshToken = validateRefreshToken(cookie?.value);
  
  await sessionService.revokeSession(validatedRefreshToken);
  
  cookieStore.delete("refresh_token");
  
  return NextResponse.json<ResponseData>({
    success: true,
    message: "Signed out successfully"
  });
});