import { db } from "@/server/db";
import { media, events } from "@/server/db/schema";
import { cloudinary } from "@/server/lib/cloudinary";
import { ConflictError, ForbiddenError, InternalServerError } from "@/server/lib/errors";
import { MediaNotFoundError } from "./media.errors";
import { ApiErrorCode } from "@/shared/errors/error-codes";
import { UploadApiResponse } from "cloudinary";
import { and, asc, desc, eq, inArray, isNotNull, isNull, lte, or } from "drizzle-orm";
import { softDelete } from "../shared/helpers/soft-delete";
import { DeleteFilesInput, DeleteOneFileInput, UploadFileInput } from "./media.types";
import { days } from "@/shared/utils/time";


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

async function assertEventOwnerShip(userId: string, eventId: string) {
  const [validEvent] = await db
    .select({ id: events.id })
    .from(events)
    .where(and(
      eq(events.id, eventId),
      eq(events.uploadedBy, userId),
      isNull(events.deletedAt),
    ));
  if (!validEvent) {
    throw new ForbiddenError("Invalid event selection", {
      code: ApiErrorCode.INVALID_EVENT_SELECTION
    });
  }
}

class MediaService {
  async uploadFile(data: UploadFileInput) {
    if (data.eventId) {
      await assertEventOwnerShip(data.userId, data.eventId);
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
        
        ...(data.eventId && {
          eventId: data.eventId
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
    if (data.eventId) {
      await assertEventOwnerShip(data.userId, data.eventId);
      const [coverReference] = await db
        .select({ id: events.id })
        .from(events)
        .where(
          and(
            eq(events.id, data.eventId),
            eq(events.coverMediaId, data.mediaId),
            isNull(events.deletedAt)
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

    if (data.eventId) {
      deleteConditions.push(
        eq(media.eventId, data.eventId)
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

  async cleanUpObseleteFiles() {
    const cutOffDate = new Date(Date.now() - days(30));

    let mediaCount = 0;

    while (true) {
      const batchMedia = await db.select({
          id: media.id,
          publicId: media.publicId
        })
        .from(media)
        .where(
          or(
            and(
              isNull(media.eventId),
              lte(media.createdAt, cutOffDate)
            ),
            lte(media.deletedAt, cutOffDate),
          )
        )
        .orderBy(asc(media.id))
        .limit(100);

      if (batchMedia.length === 0) break;
      
      mediaCount += batchMedia.length;

      cloudinary.api.delete_resources(
        batchMedia.map(m => m.publicId)
      );

      await db
        .delete(media)
        .where(inArray(media.id, batchMedia.map(m => m.id)));
    }

    return { mediaCount }
  }
}

export const mediaService = new MediaService();