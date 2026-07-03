import { NextRequest } from "next/server";
import { ApiResponse, AuthReqContext, RouteContext } from "../../shared/types/api";
import { ApiErrorCode, ForbiddenError, UnauthorizedError } from "../errors";
import { sessionService } from "@/modules/sessions/session.service"
import { validateAccessTokenPayload } from "@/modules/auth/auth.validation";

export function withAuthGuard<TParams>(handler: (req: NextRequest, context: AuthReqContext<TParams>) => ApiResponse, allowedRoles?: string[]) {
  return async (req: NextRequest, context: RouteContext<TParams>) => {
    const bearerToken = req.headers.get("Authorization");

    if (!bearerToken || !bearerToken.startsWith("Bearer"))
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });

    const token = bearerToken.split(" ")[1];
    
    let decoded;

    try {
      decoded = sessionService.verifyJwt(token);
    } catch {
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });
    }

    const validatedPayload = validateAccessTokenPayload(decoded);

    if (allowedRoles && !allowedRoles.includes(validatedPayload.role))
      throw new ForbiddenError("You are not allowed access this resource", {
        code: ApiErrorCode.INSUFFICIENT_PERMISSIONS
      });
    
    return await handler(req, {
      ...context,
      user: validatedPayload
    });
    
  };
}