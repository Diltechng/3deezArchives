import { withErrorHandler } from "@/lib/api/error-handler"
import { withInvitationGuard } from "@/lib/api/invitation-guard"
import { invitationService } from "@/modules/invitation/invitation.service";
import { validateAcceptInvite } from "@/modules/invitation/invitation.validation";
import { ResponseData } from "@/shared/types/api";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withInvitationGuard(async (req, ctx) => {
    const body = await req.json();
    const { invitationId, invitationToken } = ctx.invite;

    const validatedData = validateAcceptInvite(body);

    await invitationService.acceptInvite({
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