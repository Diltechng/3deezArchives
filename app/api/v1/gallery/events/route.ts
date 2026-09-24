import { withAuthGuard } from "@/server/lib/api/auth-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { eventsService } from "@/server/events/events.service";
import { NextResponse } from "next/server";
import { GetEventsMeta, EventDto } from "@/shared/contracts/events.contract";
import { withPermissionGuard } from "@/server/lib/api/permission-guard";
import { PERMISSION } from "@/shared/constants/permissions.constants";
import { CreateEventSchema, GetEventsQuerySchema } from "@/shared/schemas";
import { validateRequest } from "@/server/lib/api/validation";

export const POST = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSION.EVENTS_CREATE, async (req, ctx) => {
      const body = await req.json();

      const validatedData = validateRequest(CreateEventSchema, body);

      const result = await eventsService.createEvent(
        ctx.user,
        validatedData,
      );

      return NextResponse.json<ResponseData>({
        success: true,
        message: "Successfully uploaded a events",
        data: result
      }, { status: 201 });
    })
  )
);

export const GET = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSION.EVENTS_VIEW, async (req, ctx) => {
      const searchParams = Object.fromEntries(req.nextUrl.searchParams);

      const query = validateRequest(GetEventsQuerySchema, searchParams);

      const { events, meta } = await eventsService.getAllEvents(
        ctx.user,
        query,
      );

      return NextResponse.json<ResponseData<EventDto[], GetEventsMeta>>({
        success: true,
        message: `Fetched ${events.length} events successfully`,
        data: events,
        meta,
      });
    })
  )
);