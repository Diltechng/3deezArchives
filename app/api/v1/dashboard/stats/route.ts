import { db } from "@/server/db";
import { categories, events, users } from "@/server/db/schema";
import { withAuthGuard } from "@/server/lib/api/auth-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { eventsService } from "@/server/events/events.service";
import { and, count, gte, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard(async (_, ctx) => {
    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const [
      [{ count: totalEvents }],
      [{ count: totalEventsThisMonth }],
      [{ count: totalUsers }],
      [{ count: totalCategories }]
    ] = await Promise.all([
      db.select({ count: count() }).from(events).where(isNull(events.deletedAt)),
      db.select({ count: count() }).from(events).where(and(gte(events.createdAt, startOfThisMonth), isNull(events.deletedAt))),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(categories),
    ]);

    const { events: eventsList } = await eventsService.getAllEvents(
      ctx.user,
      {
        limit: 4,
        page: 1,
        sortBy: "latest",
      },
    );

    return NextResponse.json({
      success: true,
      message: "Fetched dashboard stats successfully",
      data: {
        totalEvents,
        totalEventsThisMonth,
        totalUsers,
        totalCategories,
        recentEvents: eventsList,
      }
    });
  })
);