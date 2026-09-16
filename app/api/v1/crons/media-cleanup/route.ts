import { withCronGuard } from "@/server/lib/api/cron-guard";
import { withErrorHandler } from "@/server/lib/api/error-handler";
import { mediaService } from "@/server/media/media.service";
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