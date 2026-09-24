import { withAuthGuard } from "@/server/lib/api/auth-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService } from "@/server/media/media.service";
import { validateUploadMedia } from "@/server/media/media.validation";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/server/lib/api/permission-guard";
import { PERMISSION } from "@/shared/constants/permissions.constants";

export const POST = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSION.EVENTS_CREATE, async (req, ctx) => {
      const formData = await req.formData();

      const file = formData.get("file") as File;

      const validated = validateUploadMedia({ file });

      const result = await mediaService.uploadFile({
        userId: ctx.user.userId,
        file: validated.file
      });

      return NextResponse.json<ResponseData>({
        success: true,
        message: "Media uploaded successfully",
        data: result,
      }, { status: 201 });
    })
  )
);

export const GET = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSION.EVENTS_VIEW, async () => {
      const media = await mediaService.getFiles();
      
      return NextResponse.json<ResponseData>({
        success: true,
        message: `Fetched ${media.length} media successfully`,
        data: media
      });
    })
  )
);