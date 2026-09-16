import { withAuthGuard } from "@/server/lib/api/auth-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { mediaService, } from "@/server/media/media.service"
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/server/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions.constants";
import { EventIdSchema, MediaIdSchema } from "@/shared/schemas";
import { validateRequest } from "@/server/lib/api/validation";

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