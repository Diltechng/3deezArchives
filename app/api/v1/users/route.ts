import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { mailService } from "@/modules/mailing";
import { usersService } from "@/modules/users/users.service";
import { validateGetUsersQuery, validateInviteUser } from "@/modules/users/users.validation";
import { NextResponse } from "next/server";
import { UserRole } from "@/shared/constants/enums";
import { ResponseData } from "@/shared/types/api";
import { GetUsersResponse } from "@/shared/contracts/users";

export const GET = withErrorHandler(
  withAuthGuard(async req => {
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
  }, [UserRole.ADMIN])
);

export const POST = withErrorHandler(
  withAuthGuard(async req => {
    const body = await req.json();

    const validatedData = validateInviteUser(body);

    const { otp, invitationToken } = await usersService.inviteUser(validatedData);
    
    await mailService.sendVerificationEmail({
      email: validatedData.email,
      invitationToken,
      otp,
    });
    
    return NextResponse.json<ResponseData>({
      success: true,
      message: "User invited successfully"
    });
  }, [UserRole.ADMIN])
);