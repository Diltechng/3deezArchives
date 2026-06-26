import { db } from "@/db";
import { categories, posts, users } from "@/db/schema";
import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { postsService } from "@/modules/posts/posts.service";
import { and, count, gte, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard(async (_, ctx) => {
    const startOfThisMonth = new Date();
    startOfThisMonth.setDate(1);
    startOfThisMonth.setHours(0, 0, 0, 0);

    const [
      [{ count: totalPosts }],
      [{ count: totalPostsThisMonth }],
      [{ count: totalUsers }],
      [{ count: totalCategories }]
    ] = await Promise.all([
      db.select({ count: count() }).from(posts).where(isNull(posts.deletedAt)),
      db.select({ count: count() }).from(posts).where(and(gte(posts.createdAt, startOfThisMonth), isNull(posts.deletedAt))),
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(categories),
    ]);

    const { posts: postsItems } = await postsService.getPosts({
      filters: {
        limit: 4,
        page: 1,
        date: {},
        sortBy: "latest",
      },
      userId: ctx.user.userId,
      userRole: ctx.user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Fetched dashboard stats successfully",
      data: {
        totalPosts,
        totalPostsThisMonth,
        totalUsers,
        totalCategories,
        recentPosts: postsItems,
      }
    });
  })
);