import { Permission } from "@/shared/constants/permissions";
import { hasPermission } from "@/shared/constants/policies";
import { ApiResponse, AuthReqContext } from "@/shared/types/api";
import { NextRequest } from "next/server";
import { ForbiddenError } from "../errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";

export function withPermissionGuard<TParams>(permission: Permission, handler: (req: NextRequest, context: AuthReqContext<TParams>) => ApiResponse) {
  return async (req: NextRequest, context: AuthReqContext<TParams>) => {
    
    if (!hasPermission(context.user.role, permission)) {
      throw new ForbiddenError("You do not have the privilege to perform this action.", {
        code: ApiErrorCode.NOT_ENOUGH_PRIVILEGES
      });
    };

    console.log("Has permission to", permission);
    return handler(req, context);
  }
}