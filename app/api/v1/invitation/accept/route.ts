import { withErrorHandler } from "@/lib/api/error-handler"
import { withInvitationGuard } from "@/lib/api/invitation-guard"
import { invitationsService } from "@/modules/invitations/invitations.service";
import { validateAcceptInvite } from "@/modules/invitations/invitations.validation";
import { ResponseData } from "@/shared/types/api";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withInvitationGuard(async (req, ctx) => {
    const body = await req.json();
    const { invitationId, invitationToken } = ctx.invite;

    const validatedData = validateAcceptInvite(body);

    await invitationsService.acceptInvite({
      invitationId,
      invitationToken,
      name: validatedData.name,
      password: validatedData.password,
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Account successfully created."
    });
  })
);