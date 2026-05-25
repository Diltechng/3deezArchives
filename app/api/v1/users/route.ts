import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { mailService } from "@/modules/mailing";
import { usersService } from "@/modules/users/users.service";
import { validateInviteUser } from "@/modules/users/users.validation";
import { NextResponse } from "next/server";
import { UserRole } from "@/shared/constants/enums";
import { ResponseData } from "@/lib/api/types";

export const GET = withErrorHandler(
  withAuthGuard(async req => {
    const body = await req.json();
    
    const users = await usersService.getUsers();

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Users queried successfully",
      data: users
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