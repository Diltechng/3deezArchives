import { withAuthGuard } from "@/lib/api/auth-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { ResponseData } from "@/shared/types/api";
import { categoriesService } from "@/modules/categories/categories.service";
import { NextResponse } from "next/server";
import { withPermissionGuard } from "@/lib/api/permission-guard";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { CategoryDto } from "@/shared/contracts/categories.contract";

export const GET = withErrorHandler(
  withAuthGuard(
    withPermissionGuard(PERMISSIONS.CATEGORIES_VIEW, async () => {
      const categories = await categoriesService.getCategories();

      return NextResponse.json<ResponseData<CategoryDto[]>>({
        success: true,
        message: `Fetched ${categories.length} categories successfully.`,
        data: categories
      })
    })
  )
);