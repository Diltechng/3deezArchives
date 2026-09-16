import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/types/api";
import { InternalServerError, UnauthorizedError } from "../errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";

export function withCronGuard(handler: (req: NextRequest) => ApiResponse) {
  return async (req: NextRequest) => {
    const bearerToken = req.headers.get("authorization");

    const cron_secret = process.env.CRON_SECRET;

    if (!cron_secret) {
      throw new InternalServerError("CRON_SECRET is not configured.", {
        code: ApiErrorCode.CRON_CONFIG_ERROR
      });
    }

    if (bearerToken !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new UnauthorizedError("Invalid cron secret", {
        code: ApiErrorCode.INVALID_CRON_SECRET
      });
    }
    
    return await handler(req);
  };
}