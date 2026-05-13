import { NextRequest } from "next/server";
import { ApiResponse } from "./types";
import { ApiErrorCode, UnauthorizedError } from "../errors";
import { tokenService } from "@/modules/auth";

export function withAuthGuard(handler: (req: NextRequest, context?: any) => ApiResponse) {
  return async (req: NextRequest, context?: any) => {
    const bearerToken = req.headers.get("Authorization");

    if (!bearerToken || !bearerToken.startsWith("Bearer"))
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });

    const token = bearerToken.split(" ")[1];
    
    try {
      const decoded = tokenService.verifyJwt(token);
      
      return await handler(req, {
        ...context,
        user: decoded
      });
    } catch {
      throw new UnauthorizedError("Invalid access token", {
        code: ApiErrorCode.INVALID_ACCESS_TOKEN
      });
    }
    
  };
}