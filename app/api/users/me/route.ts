import { db } from "@/db";
import { users } from "@/db/schema";
import { withAuthGuard } from "@/lib/api/auth-guard";
import { handleError } from "@/lib/api/error-handler";
import { ApiErrorCode, NotFoundError } from "@/lib/errors";
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

export const PATCH = handleError(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = body;

    const { userId } = ctx.user

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user)
      throw new NotFoundError("We encounted an error verifying your details", {
        code: ApiErrorCode.USER_NOT_FOUND
      });

    await db.update(users).set({
      name: validatedData.fullName
    });

  })
);