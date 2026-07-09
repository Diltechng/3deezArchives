import { withCronGuard } from "@/lib/api/cron-guard";
import { withErrorHandler } from "@/lib/api/error-handler";
import { mediaService } from "@/modules/media/media.service";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withCronGuard(async () => {
    const { mediaCount } = await mediaService.cleanUpObseleteFiles();

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${mediaCount} media`,
    });  
  })
);