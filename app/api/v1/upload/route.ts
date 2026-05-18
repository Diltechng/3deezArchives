import { ResponseData, withErrorHandler } from "@/lib/api/error-handler";
import { cloudinary } from "@/lib/cloudinary";
import { ApiErrorCode, BadRequestError, InternalServerError } from "@/lib/errors";
import { UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async req => {
  const formData = await req.formData();

  const file = formData.get("file") as File;

  if (!file)
    throw new BadRequestError("No media provided", {
      code: ApiErrorCode.NO_MEDIA_PROVIDED
    });

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      folder: "3deez-archives"
    },
    (error, result) => {
      if (error)
        reject(error);
      
      if (!result)
        reject(new InternalServerError("Error uploading media", {
          code: ApiErrorCode.MEDIA_UPLOAD_ERROR
        }));
      
      else resolve(result);
    }).end(buffer);
  });

  console.log(result);

  return NextResponse.json<ResponseData>({
    success: true,
    message: "Media uploaded successfully"
  }, { status: 201 });
});