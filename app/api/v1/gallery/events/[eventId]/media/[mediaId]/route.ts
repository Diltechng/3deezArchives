import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService, } from "@/modules/media/media.service"
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions.constants";
import { EventIdSchema, MediaIdSchema } from "@/shared/schemas";
import { validateRequest } from "@/lib/api/validation";

export const DELETE = withErrorHandler(
  withAuthGuard<{
    mediaId: string;
    eventId: string;
  }>(withPermissionGuard(PERMISSIONS.EVENTS_UPDATE, async (_, ctx) => {
      const { mediaId, eventId } = await ctx.params;
      
      const validatedMediaId = validateRequest(MediaIdSchema, mediaId);
      const validatedEventId = validateRequest(EventIdSchema, eventId);

      const result = await mediaService.deleteOneFile({
        userId: ctx.user.userId,
        mediaId: validatedMediaId,
        eventId: validatedEventId,
      });

      return NextResponse.json<ResponseData>({
        success: true,
        message: "Deleted media successfully",
        data: result
      })
    })
  )
);