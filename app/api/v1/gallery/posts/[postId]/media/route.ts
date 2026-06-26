import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService } from "@/modules/media/media.service";
import { validateUploadMedia } from "@/modules/media/media.validation";
import { validatePostId } from "@/modules/posts/posts.validation";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions";

export const POST = withErrorHandler(
  withAuthGuard<{ postId: string; }>(
    withPermissionGuard(PERMISSIONS.POSTS_CREATE, async (req, ctx) => {
      const postId = (await ctx.params).postId;
      const formData = await req.formData();
      
      
      const file = formData.get("file") as File;
      
      const validatedId = validatePostId(postId);
      const validated = validateUploadMedia({ file });

      const result = await mediaService.uploadFile({
        userId: ctx.user.userId,
        file: validated.file,
        postId: validatedId
      });

      return NextResponse.json<ResponseData>({
        success: true,
        message: "Media uploaded successfully",
        data: result,
      }, { status: 201 });
    })
  )
);