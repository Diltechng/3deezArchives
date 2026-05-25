import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/lib/api/types";
import { mediaService, validateMediaId } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard<Promise<{ mediaId: string; }>>(async (req, ctx) => {
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
  withAuthGuard<Promise<{ mediaId: string; }>>(async (req, ctx) => {
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