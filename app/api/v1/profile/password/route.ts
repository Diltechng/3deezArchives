import { withAuthGuard } from "@/server/lib/api/auth-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { accountService } from "@/server/account/account.service";
import { validateUpdatePassword } from "@/server/account/account.validation";
import { ResponseData } from "@/shared/types/api";
import { NextResponse } from "next/server";

export const PATCH = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = validateUpdatePassword(body);

    await accountService.updateUserPassword(validatedData, ctx.user.userId);

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Successfully updated your password"
    });
  })
);