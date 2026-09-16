import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { eventsService } from "@/server/events/events.service";
import { NextResponse } from "next/server";
import { GetEventsMeta, EventDto } from "@/shared/contracts/events.contract";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions.constants";
import { CreateEventSchema, GetEventsQuerySchema } from "@/shared/schemas";
import { validateRequest } from "@/lib/api/validation";

export const POST = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSIONS.EVENTS_CREATE, async (req, ctx) => {
      const body = await req.json();

      const validatedData = validateRequest(CreateEventSchema, body);

      const result = await eventsService.createNewEvent(
        ctx.user.userId,
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
    withPermissionGuard(PERMISSIONS.EVENTS_VIEW, async (req, ctx) => {
      const { searchParams } = req.nextUrl;
      
      const search = searchParams.get("search");
      const visibility = searchParams.get("visibility");
      const categorySlug = searchParams.get("category");
      const sortBy = searchParams.get("sortBy");
      const dateFrom = searchParams.get("from");
      const dateTo = searchParams.get("to");

      const validatedFilters = validateRequest(
        GetEventsQuerySchema,
        {
          page: searchParams.get("page"),
          limit: searchParams.get("limit"),
          ...(search && { search }),
          ...(visibility && { visibility }),
          ...(categorySlug && { categorySlug }),
          ...(sortBy && { sortBy }),
          date: {
            ...(dateFrom && { from: dateFrom }),
            ...(dateTo && { to: dateTo }),
          },
        }
      );

      const { events, meta } = await eventsService.getEvents({
        userId: ctx.user.userId,
        userRole: ctx.user.role,
        filters: validatedFilters,
      });

      return NextResponse.json<ResponseData<EventDto[], GetEventsMeta>>({
        success: true,
        message: `Fetched ${events.length} events successfully`,
        data: events,
        meta,
      });
    })
  )
);