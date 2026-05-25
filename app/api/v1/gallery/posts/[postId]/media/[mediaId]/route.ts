import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/lib/api/types";
import { mediaService, validateMediaId, validatePostId } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const DELETE = withErrorHandler(
  withAuthGuard<Promise<{
    mediaId: string;
    postId: string;
  }>>(async (req, ctx) => {
    const { mediaId, postId } = await ctx.params;
    
    const validatedMediaId = validateMediaId(mediaId);
    const validatedPostId = validatePostId(postId);

    const result = await mediaService.deleteOneFile({
      userId: ctx.user.userId,
      mediaId: validatedMediaId,
      postId: validatedPostId,
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Deleted media successfully",
      data: result
    })
  })
);