import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { postsService, validatePostId, validateUpdatePost } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard<Promise<{ postId: string; }>>(async (req, ctx) => {
    const postId = (await ctx.params).postId;

    const validatedId = validatePostId(postId);

    const result = await postsService.getOnePost({
      postId: validatedId,
      userId: ctx.user.userId,
      userRole: ctx.user.role,
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Fetched 1 post successfully",
      data: result,
    })
  })
);

export const PATCH = withErrorHandler(
  withAuthGuard<Promise<{ postId: string; }>>(async (req, ctx) => {
    const postId = (await ctx.params).postId;
    const body = await req.json();
    
    const validatedId = validatePostId(postId);
    const validatedData = validateUpdatePost(body);

    const result = await postsService.updateOnePost({
      postId: validatedId,
      data: validatedData,
      userId: ctx.user.userId,
      userRole: ctx.user.role
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Updated ${result ? 1: 0} posts successfully.`,
      data: result
    });
  })
);

export const DELETE = withErrorHandler(
  withAuthGuard<Promise<{ postId: unknown; }>>(async (req, ctx) => {
    const { postId } = await ctx.params;

    const validatedPostId = validatePostId(postId);

    const result = await postsService.deleteOnePost({
      postId: validatedPostId,
      userId: ctx.user.userId,
      userRole: ctx.user.role,
    })

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Deleted ${result? 1: 0} posts successfully.`,
      data: result
    })
  })
);