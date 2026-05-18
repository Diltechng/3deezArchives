import { NextRequest } from "next/server";
import { ApiResponse } from "./types";
import { ApiErrorCode, UnauthorizedError } from "../errors";
import { tokenService, validateAccessTokenPayload } from "@/modules/auth";
import { AccessTokenPayload } from "../schemas";

export type AuthReqContext = {
  user: AccessTokenPayload;
} & Record<string, unknown>;

export function withAuthGuard(handler: (req: NextRequest, context: AuthReqContext) => ApiResponse) {
  return async (req: NextRequest, context?: Record<string, unknown>) => {
    const bearerToken = req.headers.get("Authorization");

    if (!bearerToken || !bearerToken.startsWith("Bearer"))
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });

    const token = bearerToken.split(" ")[1];
    
    try {
      const decoded = tokenService.verifyJwt(token);

      const validatedPayload = validateAccessTokenPayload(decoded);
      
      return await handler(req, {
        ...context,
        user: validatedPayload
      });
    } catch {
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });
    }
    
  };
}