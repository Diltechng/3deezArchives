import { withErrorHandler } from "@/lib/api/error-handler";
import { withInvitationGuard } from "@/lib/api/invitation-guard";
import { invitationsService } from "@/modules/invitations/invitations.service";
import { VerifyInvitationResponse } from "@/shared/contracts/invitations.contract";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withInvitationGuard(async (req, ctx) => {
    
    const result = await invitationsService.verifyInvitation({
      invitationId: ctx.invite.invitationId,
      invitationToken: ctx.invite.invitationToken,
    });

    return NextResponse.json<VerifyInvitationResponse>({
      success: true,
      message: "Invitation token verified successfully",
      data: result
    });
  })
);