import { withAuthGuard } from "@/server/lib/api/auth-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { mailService } from "@/server/mailing/mail.service";
import { usersService } from "@/server/users/users.service";
import { validateGetUsersQuery, validateInviteUser } from "@/server/users/users.validation";
import { NextResponse } from "next/server";
import { ResponseData } from "@/shared/types/api";
import { GetUsersResponse } from "@/shared/contracts/users.contract";
import { invitationsService } from "@/server/invitations/invitations.service";
import { withPermissionGuard } from "@/server/lib/api/permission-guard";
import { PERMISSION } from "@/shared/constants/permissions.constants";

export const GET = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSION.USERS_VIEW, async req => {
      const { searchParams } = req.nextUrl;

      const search = searchParams.get("search");
      const role = searchParams.get("role");
      const status = searchParams.get("status");
      const sortBy = searchParams.get("sortBy");
      const dateFrom = searchParams.get("from");
      const dateTo = searchParams.get("to");

      const validatedFilters = validateGetUsersQuery({
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
        ...(sortBy && { sortBy }),
        date: {
          ...(dateFrom && { from: dateFrom }),
          ...(dateTo && { to: dateTo }),
        }
      })

      const { users, meta } = await usersService.getUsers({ filters: validatedFilters });

      return NextResponse.json<GetUsersResponse>({
        success: true,
        message: "Users queried successfully",
        data: users,
        meta
      });
    })
  )
);

export const POST = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSION.USERS_INVITE, async (req, ctx) => {
      const body = await req.json();

      const validatedData = validateInviteUser(body);

      const { otp, invitationToken, inviter, invitationId } = await invitationsService.inviteUser({
        invitee: validatedData,
        inviter: { userId: ctx.user.userId }
      });

      const invitationJwt = invitationsService.signInvitationJwt({
        invitationId,
        invitationToken,
      });
      
      await mailService.sendInvitationEmail({
        inviteeEmail: validatedData.email,
        inviteeRole: validatedData.role,
        invitationJwt,
        otp,
        inviterEmail: inviter.email,
        inviterName: inviter.name ?? inviter.email,
      });
      
      return NextResponse.json<ResponseData>({
        success: true,
        message: "User invited successfully"
      });
    })
  )
);