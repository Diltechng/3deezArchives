import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { categoriesService } from "@/modules/gallery";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions";

export const GET = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSIONS.CATEGORIES_VIEW, async () => {
      const categories = await categoriesService.getCategories();

      return NextResponse.json<ResponseData>({
        success: true,
        message: `Fetched ${categories.length} categories successfully.`,
        data: categories
      })
    })
  )
);