import { withCronGuard } from "@/lib/api/cron-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { mediaService } from "@/modules/media/media.service";
import { ResponseData } from "@/shared/types/api";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withCronGuard(async () => {
    const { mediaCount } = await mediaService.cleanUpObseleteFiles();

    return NextResponse.json<ResponseData>({
      success: true,
      message: `Successfully cleaned up ${mediaCount} media`,
    });  
  })
);