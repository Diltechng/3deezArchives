import FormField from "@/features/shared/components/FormField";
import LoadingState from "@/features/shared/components/LoadingState";
import { AlertCircle, RefreshCw, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FieldError, Merge } from "react-hook-form"
import { MediaUploadItem } from "../types";
import { cn } from "@/features/shared/lib/utils";
import { toast } from "react-toastify";
import { CreatePostInput, UploadMediaSchema } from "@/shared/schemas";
import z from "zod";
import { api } from "@/features/shared/lib/api";

const PostMediaField = ({ error, value, onChange }: {
  error?: Merge<FieldError, (FieldError | undefined)[]> | FieldError;
  value?: CreatePostInput["media"];
  onChange?: (next: CreatePostInput["media"]) => void;
}) => {
  const [media, setMedia] = useState<MediaUploadItem[]>([]);
  const fileCacheRef = useRef<Map<string, File>>(new Map());

  async function handleUploadMedia(localId: string) {
    const file = fileCacheRef.current.get(localId);
    
    if (!file)
      return;

    try {
      setMedia(prev => prev.map(fileUpload => {
        if (fileUpload.local.id === localId) {
          fileUpload.status = "uploading";
        }
        return fileUpload;
      }));

      const formDataPayload = new FormData();
      formDataPayload.append("file", file);

      const response = await api.post("/gallery/media", formDataPayload);

      const result = response.data;

      if (!result.success) {
        throw new Error(result.error.message);
      }

      setMedia(prev => prev.map(fileUpload => {
        if (fileUpload.local.id === localId) {
          fileUpload.status = "ready";
          fileUpload.remote = {
            id: result.data.id,
            url: result.data.secureUrl
          }
        }
        return fileUpload;
      }));

      if (!value) return;
      onChange?.({
        ids: [...value.ids, result.data.id],
        coverId: value.coverId ?? result.data.id
      });

    } catch (error: any) {
      setMedia(prev => prev.map(fileUpload => {
        if (fileUpload.local.id === localId) {
          fileUpload.status = "failed";

          return fileUpload;
        }

        return fileUpload;
      }));

      toast(error.message, { type: "error" });
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
                    
    if (!files.length) return;

    files.forEach(async file => {
      const result = UploadMediaSchema.safeParse({ file });

      if (!result.success) {
        const parsedErrors = z.flattenError(result.error).fieldErrors.file;
        
        return toast(parsedErrors?.[0] || "Something went wrong", { type: "error" });
      }

      const localId = crypto.randomUUID();
      const localUrl = URL.createObjectURL(file);

      const newFile: MediaUploadItem = {
        local: {
          id: localId,
          url: localUrl
        },
        remote: null,
        fileName: file.name,
        status: "uploading",
      }
      setMedia(prev => [...prev, newFile]);

      fileCacheRef.current.set(newFile.local.id, file);

      await handleUploadMedia(newFile.local.id);      
    });
  }

  function handleRemoveMedia(remoteId?: string) {
    if (!remoteId || (value && value.coverId === remoteId)) return;
    
    setMedia(prev => prev.filter(fileUpload => fileUpload.remote?.id !== remoteId));
    
    if (!value) return;
    onChange?.({
      ids: value.ids.filter(id => id !== remoteId),
      coverId: value.coverId
    });
  }

  useEffect(() => {
    return () => media.forEach(fileUpload => 
      URL.revokeObjectURL(fileUpload.local.url)
    );
  }, []);
  
  return (
    <>
      <FormField error={error}>
        <div className="input-core h-30 border-dashed">
          <label className="flex flex-col justify-center items-center gap-1.5 h-full w-full font-sans text-[11px] text-text-3">
            <span>Drop image here or click to browse</span>
            <span>JPG, PNG, WEBP — max 10MB</span>
            <input
              className="hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </FormField>
      {media.length !== 0 &&
        <div className="p-4 grid grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg border border-border-2 bg-surface-3">
          {media.map(file => (
            <div
              key={file.local.id}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden duration-200 border border-transparent",
                (value?.coverId && file.remote?.id === value.coverId) && "border-accent"
              )}
            >
              <img
                src={file.local.url}
                className="h-full w-full object-cover"
              />
              {(file.status === "uploading")
                ? (
                  <div className="absolute top-0 flex p-2 h-full w-full duration-200 bg-linear-to-t from-black/90 via-black/50 to-black/20">
                    <LoadingState />
                  </div>
                ) : (file.status === "ready" && file.remote)
                ? (
                  <>
                    <div className="absolute top-0 p-2 h-full w-full duration-200 opacity-0 hover:opacity-100 bg-linear-to-t from-black/60 via-black/20 to-transparent">
                      {!(value?.coverId && file.remote.id === value.coverId) && <div className="flex justify-end gap-1 h-7">
                        <button
                          className="p-1 aspect-square rounded-sm border border-border-2 bg-surface-3"
                          type="button"
                          onClick={() => {
                            if (!file.remote?.id || !value) return;
                            
                            onChange?.({
                              ids: value.ids,
                              coverId: file.remote.id
                            });
                          }}
                        >
                          <Star className="h-full w-full" />
                        </button>
                        <button
                          className="p-1 aspect-square rounded-sm border border-border-2 bg-surface-3"
                          type="button"
                          onClick={() => handleRemoveMedia(file.remote?.id)}
                        >
                          <Trash2 className="h-full w-full" />
                        </button>
                      </div>}
                    </div>
                    {(value?.coverId && file.remote.id === value.coverId) && <div className="absolute bottom-2 right-2 flex gap-1 items-center py-1 px-2 rounded-sm font-sans text-xs text-surface-2 bg-accent">
                      <Star className="fill-current h-3 w-3" /> Cover
                    </div>}
                  </>
                )
                : <div className="absolute top-0 flex flex-col justify-center items-center p-2 h-full w-full duration-200 bg-linear-to-t from-black/90 via-black/50 to-black/20">
                    <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                    <span className="text-[10px] font-black tracking-wider text-red-200 uppercase">UPLOAD FAILED</span>
                    <button
                      onClick={() => handleUploadMedia(file.local.id)}
                      className="mt-2 px-2.5 py-1 bg-white hover:bg-slate-100 text-red-700 font-extrabold text-[10px] rounded transition-all shadow-sm flex items-center gap-1 focus:outline-none"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Retry
                    </button>
                  </div>
              }
            </div>
          ))}
        </div>
      }
    </>
  );
}

export default PostMediaField;