import { db } from "@/db";
import { users } from "@/db/schema";
import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { ApiErrorCode, NotFoundError } from "@/lib/errors";
import { UserRole } from "@/shared/constants/enums";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

let i = 0;

export const GET = withErrorHandler(
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
  }, [UserRole.ADMIN, UserRole.STAFF])
);

export const PATCH = withErrorHandler(
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
      name: validatedData.fullName,
      updatedAt: sql`now()`,
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Profile successfully updated",
    }, { status: 200 });

  }, [UserRole.ADMIN, UserRole.STAFF])
);