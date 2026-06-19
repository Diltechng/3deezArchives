import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { postsService, validateCreatePost, validateGetPostsQuery } from "@/modules/gallery";
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
    const { searchParams } = req.nextUrl;
    
    const search = searchParams.get("search");
    const visibility = searchParams.get("visibility");
    const categorySlug = searchParams.get("category");
    const sortBy = searchParams.get("sortBy");
    const dateFrom = searchParams.get("from");
    const dateTo = searchParams.get("to");

    const validatedFilters = validateGetPostsQuery({
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
    });

    const { posts, meta } = await postsService.getPosts({
      userId: ctx.user.userId,
      userRole: ctx.user.role,
      filters: validatedFilters,
    });

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Fetched ${posts.length} posts successfully`,
      data: posts,
      meta,
    });
  })
);