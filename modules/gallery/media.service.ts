import { db } from "@/db";
import { media } from "@/db/schema";
import { cloudinary } from "@/lib/cloudinary";
import { ApiErrorCode, InternalServerError, MediaNotFoundError, NotFoundError } from "@/lib/errors";
import { UploadApiResponse } from "cloudinary";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { softDelete } from "../shared/helpers/soft-delete";

interface UploadFileInput {
  file: File,
  userId: string;
}

interface DeleteOneFileInput {
  mediaId: string;
  userId: string;
}

interface DeleteFilesInput {
  mediaIds: string[];
  userId: string;
}

interface UpdateOneFileInput {
  mediaId: string;
  userId: string;
  data: {

  }
}

export const mediaSelect = {
  id: media.id,
  publicId: media.publicId,
  secureUrl: media.secureUrl,
  bytes: media.bytes,
  width: media.width,
  height: media.height,
  originalFileName: media.originalFileName,
  uploadedAt: media.uploadedAt,
  mimeType: media.mimeType,
}

class MediaService {
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
        originalFileName: data.file.name,
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
      await cloudinary.uploader.destroy(uploadedFile.public_id, {
        resource_type: uploadedFile.resource_type,
      });

      throw error;
    }
  }

  async getFiles() {
    const storedMedia = await db.select(mediaSelect)
      .from(media)
      .where(isNull(media.deletedAt))
      .orderBy(desc(media.uploadedAt));

    return storedMedia;
  }

  async getOneFile(mediaId: string) {
    const [storedMedia] = await db.select(mediaSelect)
      .from(media)
      .where(and(
        eq(media.id, mediaId),
        isNull(media.deletedAt),
      ));

    if (!storedMedia)
      throw MediaNotFoundError();

    return storedMedia;
  }

  async deleteOneFile(data: DeleteOneFileInput) {
    const [deletedMedia] = await softDelete(db, media, {
      actorId: data.userId,
      where: eq(media.id, data.mediaId)
    })
    .returning({
      id: media.id,
      secureUrl: media.secureUrl,
      deletedAt: media.deletedAt,
      deletedBy: media.deletedBy,
    });

    if (!deletedMedia)
      throw MediaNotFoundError();

    return deletedMedia;
  }

  async deleteFiles(data: DeleteFilesInput) {
    const deletedMedia = await softDelete(db, media, {
      actorId: data.userId,
      where: inArray(media.id, data.mediaIds)
    })
    .returning({
      id: media.id,
      secureUrl: media.secureUrl,
      deletedAt: media.deletedAt,
      deletedBy: media.deletedBy,
    });

    return deletedMedia;
  }
}

export const mediaService = new MediaService();