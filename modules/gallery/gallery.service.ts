import { db } from "@/db";
import { media } from "@/db/schema";
import { cloudinary } from "@/lib/cloudinary";
import { ApiErrorCode, InternalServerError } from "@/lib/errors";
import { UploadApiResponse } from "cloudinary";
import { desc } from "drizzle-orm";

interface UploadFileInput {
  file: File,
  userId: string;
}

class GalleryService {
  async uploadFile(data: UploadFileInput) {
    const bytes = await data.file.arrayBuffer();
    
    const buffer = Buffer.from(bytes);
  
    const uploadedFile = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: "3deez-archives"
      },
      (error, uploadedFile) => {
        if (error)
          reject(error);
        
        if (!uploadedFile)
          reject(new InternalServerError("Error uploading media", {
            code: ApiErrorCode.MEDIA_UPLOAD_ERROR
          }));
        
        else resolve(uploadedFile);
      }).end(buffer);
    });

    try {
      const [storedMedia] = await db.insert(media).values({
        assetId: uploadedFile.asset_id,
        publicId: uploadedFile.public_id,
        secureUrl: uploadedFile.secure_url,
        
        mimeType: data.file.type,
        bytes: uploadedFile.bytes,
        format: uploadedFile.format,
        originalFileName: uploadedFile.original_filename,
        resourceType: uploadedFile.resource_type,
        height: uploadedFile.height,
        width: uploadedFile.width,      
        
        uploadedBy: data.userId,
        uploadedAt: new Date(uploadedFile.created_at),
      }).returning({
        id: media.id,
        secureUrl: media.secureUrl,
      });

      return {
        id: storedMedia.id,
        secureUrl: storedMedia.secureUrl,
      }
    } catch (error) {
      await cloudinary.uploader.destroy(uploadedFile.public_id);

      throw error;
    }
  }

  async getFiles() {
    const storedMedia = await db.select({
      id: media.id,
      publicId: media.publicId,
      secureUrl: media.secureUrl,
      bytes: media.bytes,
      width: media.width,
      height: media.height,
      originalFileName: media.originalFileName,
      uploadedAt: media.uploadedAt,
      mimeType: media.mimeType,
    }).from(media).orderBy(desc(media.uploadedAt));

    return storedMedia;
  }
}

export const galleryService = new GalleryService();