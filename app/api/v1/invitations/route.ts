import { withAuthGuard } from "@/lib/api/auth-guard"
import { withErrorHandler } from "@/lib/api/error-handler"
import { withPermissionGuard } from "@/lib/api/permission-guard"
import { invitationsService } from "@/modules/invitations/invitations.service";
import { validateGetInvitationsQuery } from "@/modules/invitations/invitations.validation";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { ResponseData } from "@/shared/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSIONS.INVITATIONS_VIEW, async (req) => {
      const { searchParams } = req.nextUrl;
      
      const search = searchParams.get("search");
      const role = searchParams.get("role");
      const status = searchParams.get("status");
      const sortBy = searchParams.get("sortBy");
      const dateFrom = searchParams.get("from");
      const dateTo = searchParams.get("to");

      const validatedFilters = validateGetInvitationsQuery({
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
      });

      const { meta, invitations } = await invitationsService.getInvitiations({
        filters: validatedFilters
      });

      return NextResponse.json<ResponseData>({
        success: true,
        message: "Invitations queried successfully",
        data: invitations,
        meta
      });
    })
  )
);