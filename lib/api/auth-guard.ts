import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "./types";
import { ApiErrorCode, ForbiddenError, UnauthorizedError } from "../errors";
import { sessionService, validateAccessTokenPayload } from "@/modules/auth";
import { AccessTokenPayload } from "../schemas";

export type AuthReqContext = {
  user: AccessTokenPayload;
} & Record<string, unknown>;

export function withAuthGuard(handler: (req: NextRequest, context: AuthReqContext) => ApiResponse, allowedRoles?: string[]) {
  return async (req: NextRequest, context?: Record<string, unknown>) => {
    const bearerToken = req.headers.get("Authorization");

    if (!bearerToken || !bearerToken.startsWith("Bearer"))
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });

    const token = bearerToken.split(" ")[1];
    
    try {
      const decoded = sessionService.verifyJwt(token);

      const validatedPayload = validateAccessTokenPayload(decoded);

      if (allowedRoles && !allowedRoles.includes(validatedPayload.role))
        throw new ForbiddenError("You are not allowed to invite users", {
          code: ApiErrorCode.INSUFFICIENT_PERMISSIONS
        });
      
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