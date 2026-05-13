import { db } from "@/db";
import { users } from "@/db/schema";
import { withAuthGuard } from "@/lib/api/auth-guard";
import { handleError } from "@/lib/api/error-handler";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

let i = 0;

export const GET = handleError(
  withAuthGuard(async (req: NextRequest, ctx) => {
    const [user] = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
    }).from(users).where(eq(users.id, ctx.user.userId));

    return NextResponse.json({
      success: true,
      message: "Successfully hit the home endpoint",
      data: { ctx, user, count: ++i }
    }, { status: 200 });
  })
);