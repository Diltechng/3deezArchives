import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { galleryService, validateDeleteMedia, validateUploadMedia } from "@/modules/gallery";
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

export const GET = withErrorHandler(
  withAuthGuard(async () => {
    const media = await galleryService.getFiles();
    
    return NextResponse.json<ResponseData>({
      success: true,
      message: `Fetched ${media.length} media successfully`,
      data: media
    });
  })
);

export const DELETE = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = validateDeleteMedia(body);

    const result = await galleryService.deleteFiles({
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