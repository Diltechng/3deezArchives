import { NextRequest } from "next/server";
import { ApiResponse, InvitationReqContext } from "../../shared/types/api";
import { ApiErrorCode, VerificationError } from "../errors";
import { invitationService } from "@/modules/invitation/invitation.service";
import { validateInvitationJwtPayload } from "@/modules/invitation/invitation.validation";
import { INVITATION_TOKEN_HEADER } from "@/shared/constants";

export function withInvitationGuard<TParams>(handler: (req: NextRequest, context: InvitationReqContext<TParams>) => ApiResponse) {
  return async (req: NextRequest, context: { params: TParams }) => {
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