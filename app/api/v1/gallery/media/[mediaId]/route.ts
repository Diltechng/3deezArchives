import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService } from "@/modules/media/media.service";
import { validateMediaId } from "@/modules/media/media.validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard<{ mediaId: string; }>(async (req, ctx) => {
    const { mediaId } = await ctx.params;

    const validatedId = validateMediaId(mediaId);
    
    const result = await mediaService.getOneFile(validatedId);

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Fetch media successfully",
      data: result
    });
  })
);

export const DELETE = withErrorHandler(
  withAuthGuard<{ mediaId: string; }>(async (req, ctx) => {
    const { mediaId } = await ctx.params;

    const validatedId = validateMediaId(mediaId);

    const result = await mediaService.deleteOneFile({
      userId: ctx.user.userId,
      mediaId: validatedId
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Deleted media successfully",
      data: result
    })
  })
);