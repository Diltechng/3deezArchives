import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService, validateMediaId, validatePostId } from "@/modules/gallery";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions";

export const DELETE = withErrorHandler(
  withAuthGuard<{
    mediaId: string;
    postId: string;
  }>(withPermissionGuard(PERMISSIONS.POSTS_UPDATE, async (_, ctx) => {
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
  )
);