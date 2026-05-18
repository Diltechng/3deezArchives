import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { RoleSchema } from "@/lib/schemas";
import { mailService } from "@/modules/mailing";
import { usersService } from "@/modules/users/users.service";
import { validateInviteUser } from "@/modules/users/users.validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard(async req => {
    const body = await req.json();
    
    const users = await usersService.getUsers();

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Users queried successfully",
      data: users
    });
  }, [RoleSchema.enum.admin])
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
  }, [RoleSchema.enum.admin])
);