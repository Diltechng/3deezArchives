import { withAuthGuard } from "@/lib/api/auth-guard";
import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { galleryService, validateGetOneMedia } from "@/modules/gallery";
import { NextResponse } from "next/server";

export const GET = withErrorHandler(
  withAuthGuard<Promise<{ id: string }>>(async (req, ctx) => {
    const mediaId = (await ctx.params).id;

    const validatedId = validateGetOneMedia(mediaId);
    
    const result = await galleryService.getOneFile(validatedId);

    return NextResponse.json<ResponseData>({
      success: true,
      message: "Fetch media successfully",
      data: result
    });
  })
);