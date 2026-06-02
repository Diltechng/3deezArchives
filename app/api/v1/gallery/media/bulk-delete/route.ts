import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService, validateDeleteMedia } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = validateDeleteMedia(body);

    const result = await mediaService.deleteFiles({
      mediaIds: validatedData.mediaIds,
      userId: ctx.user.userId
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Deleted ${result.length} media successfully`,
      data: result
    });
  })
);