import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService } from "@/server/media/media.service";
import { validateUploadMedia } from "@/server/media/media.validation";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions.constants";
import { EventIdSchema } from "@/shared/schemas";
import { validateRequest } from "@/lib/api/validation";

export const POST = withErrorHandler(
  withAuthGuard<{ eventId: string; }>(
    withPermissionGuard(PERMISSIONS.EVENTS_CREATE, async (req, ctx) => {
      const { eventId } = await ctx.params;
      const formData = await req.formData();
      
      
      const file = formData.get("file") as File;
      
      const validatedId = validateRequest(EventIdSchema, eventId);
      const validated = validateUploadMedia({ file });

      const result = await mediaService.uploadFile({
        userId: ctx.user.userId,
        file: validated.file,
        eventId: validatedId
      });

      return NextResponse.json<ResponseData>({
        success: true,
        message: "Media uploaded successfully",
        data: result,
      }, { status: 201 });
    })
  )
);