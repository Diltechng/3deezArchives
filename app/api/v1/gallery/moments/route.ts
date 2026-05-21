import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { momentsService, validateCreateMoment } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = validateCreateMoment(body);

    const result = await momentsService.createNewMoment({
      data: validatedData,
      userId: ctx.user.userId
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Successfully uploaded moment",
      data: result
    }, { status: 201 });
  })
);

export const GET = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const moments = await momentsService.getMoments({
      user: {
        id: ctx.user.userId,
        role: ctx.user.role
      }
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Fetched ${moments.length} moments successfully`,
      data: moments
    });
  })
);