import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { accountService } from "@/modules/account/account.service";
import { validateUpdateFullName } from "@/modules/account/account.validation";
import { ResponseData } from "@/shared/types/api";
import { NextResponse } from "next/server";

export const PATCH = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = validateUpdateFullName(body);

    await accountService.updateUserFullName(validatedData, ctx.user.userId);

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Successfully updated your name"
    });
  })
);