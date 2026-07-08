import { db } from "@/db";
import { media, posts } from "@/db/schema";
import { cloudinary } from "@/lib/cloudinary";
import { ConflictError, ForbiddenError, InternalServerError } from "@/lib/errors";
import { MediaNotFoundError } from "./media.errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { UploadApiResponse } from "cloudinary";
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { softDelete } from "../shared/helpers/soft-delete";
import { DeleteFilesInput, DeleteOneFileInput, UploadFileInput } from "./media.types";


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

async function assertPostOwnerShip(userId: string, postId: string) {
  const [validPost] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(and(
      eq(posts.id, postId),
      eq(posts.uploadedBy, userId),
      isNull(posts.deletedAt),
    ));
  if (!validPost) {
    throw new ForbiddenError("Invalid post selection", {
      code: ApiErrorCode.INVALID_POST_SELECTION
    });
  }
}

class MediaService {
  async uploadFile(data: UploadFileInput) {
    if (data.postId) {
      await assertPostOwnerShip(data.userId, data.postId);
    }


    const bytes = await data.file.arrayBuffer();
    
    const buffer = Buffer.from(bytes);
  
    const uploadedFile = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? (process.env.NODE_ENV === "production" ? "3deez-archives/prod": "3deez-archives/dev")
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
        
        ...(data.postId && {
          postId: data.postId
        }),

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
    if (data.postId) {
      await assertPostOwnerShip(data.userId, data.postId);
      const [coverReference] = await db
        .select({ id: posts.id })
        .from(posts)
        .where(
          and(
            eq(posts.id, data.postId),
            eq(posts.coverMediaId, data.mediaId),
            isNull(posts.deletedAt)
          )
        );
      
      if (coverReference) {
        throw new ConflictError("Cannot delete active cover image.", {
          code: ApiErrorCode.ACTIVE_COVER_MEDIA_DELETE_CONFLICT
        }); 
      }
    }

    const deleteConditions = [
      eq(media.id, data.mediaId),
    ];

    if (data.postId) {
      deleteConditions.push(
        eq(media.postId, data.postId)
      );
    } 

    const [deletedMedia] = await softDelete(db, media, {
      actorId: data.userId,
      where: and(...deleteConditions)
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