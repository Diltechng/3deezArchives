import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { eventsService } from "@/modules/events/events.service";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions.constants";
import { DeleteEventByIdResponse, EventDto, UpdateEventByIdResponse } from "@/shared/contracts/events.contract";
import { validateRequest } from "@/lib/api/validation";
import { EventIdSchema, UpdateEventSchema } from "@/shared/schemas";

export const GET = withErrorHandler(
  withAuthGuard<{ eventId: string; }>(
    withPermissionGuard(PERMISSIONS.EVENTS_VIEW, async (req, ctx) => {
      const { eventId } = await ctx.params;

      const validatedId = validateRequest(EventIdSchema ,eventId);

      const result = await eventsService.getOneEvent({
        eventId: validatedId,
        userId: ctx.user.userId,
        userRole: ctx.user.role,
      });

      return NextResponse.json<ResponseData<EventDto>>({
        success: true,
        message: "Fetched 1 event successfully",
        data: result,
      })
    })
  )
);

export const PATCH = withErrorHandler(
  withAuthGuard<{ eventId: string; }>(
    withPermissionGuard(PERMISSIONS.EVENTS_UPDATE, async (req, ctx) => {
      const { eventId } = await ctx.params;
      const body = await req.json();
      
      const validatedId = validateRequest(EventIdSchema, eventId);
      const validatedData = validateRequest(UpdateEventSchema, body);

      const result = await eventsService.updateOneEvent({
        eventId: validatedId,
        data: validatedData,
        userId: ctx.user.userId,
        userRole: ctx.user.role
      });

      return NextResponse.json<UpdateEventByIdResponse>({
        success: true,
        message: `Updated ${result ? 1: 0} events successfully.`,
        data: result
      });
    })
  )
);

export const DELETE = withErrorHandler(
  withAuthGuard<{ eventId: unknown; }>(
    withPermissionGuard(PERMISSIONS.EVENTS_DELETE, async (req, ctx) => {
      const { eventId } = await ctx.params;

      const validatedEventId = validateRequest(EventIdSchema, eventId);

      const result = await eventsService.deleteOneEvent({
        eventId: validatedEventId,
        userId: ctx.user.userId,
        userRole: ctx.user.role,
      })

      return NextResponse.json<DeleteEventByIdResponse>({
        success: true,
        message: `Deleted ${result? 1: 0} events successfully.`,
        data: result
      })
    })
  )
);