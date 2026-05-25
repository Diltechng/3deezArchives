import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/lib/api/types";
import { mediaService, validatePostId, validateUploadMedia } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withAuthGuard<Promise<{ postId: string; }>>(async (req, ctx) => {
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
);