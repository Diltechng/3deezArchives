import { NextRequest } from "next/server";
import { ApiResponse, InvitationReqContext, RouteContext } from "../../shared/types/api";
import { VerificationError } from "../errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { invitationService } from "@/modules/invitations/invitation.service";
import { validateInvitationJwtPayload } from "@/modules/invitations/invitation.validation";
import { INVITATION_TOKEN_HEADER } from "@/shared/constants";

export function withInvitationGuard<TParams>(handler: (req: NextRequest, context: InvitationReqContext<TParams>) => ApiResponse) {
  return async (req: NextRequest, context: RouteContext<TParams>) => {
    const bearerToken = req.headers.get(INVITATION_TOKEN_HEADER);

    if (!bearerToken || !bearerToken.startsWith("Bearer"))
      throw new VerificationError("Invalid invitation token", {
        code: ApiErrorCode.INVALID_INVITATION_TOKEN
      });

    const token = bearerToken.split(" ")[1];
    
    let decoded;

    try {
      decoded = invitationService.verifyInvitationJwt(token);
    } catch {
      throw new VerificationError("Invalid invitation token", {
        code: ApiErrorCode.INVALID_INVITATION_TOKEN
      });
    }

    const validatedPayload = validateInvitationJwtPayload(decoded);
    
    return await handler(req, {
      ...context,
      invite: validatedPayload
    });
    
  };
}