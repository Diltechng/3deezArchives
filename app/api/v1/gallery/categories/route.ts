import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/lib/api/types";
import { categoriesService } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard(async () => {
    const categories = await categoriesService.getCategories();

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Fetched ${categories.length} categories successfully.`,
      data: categories
    })
  })
);