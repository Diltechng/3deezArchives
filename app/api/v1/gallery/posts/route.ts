import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { postsService, validateCreatePost } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const body = await req.json();

    const validatedData = validateCreatePost(body);

    const result = await postsService.createNewPost({
      data: validatedData,
      userId: ctx.user.userId
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Successfully uploaded a post",
      data: result
    }, { status: 201 });
  })
);

export const GET = withErrorHandler(
  withAuthGuard(async (req, ctx) => {
    const posts = await postsService.getPosts({
      user: {
        id: ctx.user.userId,
        role: ctx.user.role
      }
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Fetched ${posts.length} posts successfully`,
      data: posts
    });
  })
);