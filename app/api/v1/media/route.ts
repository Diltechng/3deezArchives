import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { galleryService, validateUploadMedia } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    const validated = validateUploadMedia({ file });

    const result = await galleryService.uploadFile({
      userId: ctx.user.userId,
      file: validated.file
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Media uploaded successfully",
      data: result,
    }, { status: 201 });
  })
);