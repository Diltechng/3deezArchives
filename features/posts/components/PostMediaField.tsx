import FormField from "@/features/common/components/FormField";
import LoadingState from "@/features/common/components/LoadingState";
import { AlertCircle, RefreshCw, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FieldError, Merge } from "react-hook-form"
import { Media, MediaUploadItem } from "../types";
import { cn, getErrorMessage } from "@/features/common/lib/utils";
import { toast } from "react-toastify";
import { CreatePostInput, UploadMediaSchema } from "@/shared/schemas";
import z from "zod";
import { api } from "@/features/common/lib/api";
import { CldImage } from "next-cloudinary";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PostMediaField = ({ error, value, initialData, onChange }: {
  error?: Merge<FieldError, (FieldError | undefined)[]> | FieldError;
  value?: CreatePostInput["media"];
  initialData?: {
    postId: string;
    media: Media[]
  };
  onChange?: (next: CreatePostInput["media"]) => void;
}) => {
  const initialMedia: MediaUploadItem[] = [
    ...(initialData
    ? initialData.media.map(media => ({
      remote: {
        id: media.id,
        url: media.secureUrl
      },
      local: {
        id: "",
        url: ""
      },
      fileName: media.id,
      status: "ready"
    } as MediaUploadItem))
    : [])
  ];

  const [media, setMedia] = useState<MediaUploadItem[]>(initialMedia);
  const fileCacheRef = useRef<Map<string, File>>(new Map());

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (localId: string) => {
      const file = fileCacheRef.current.get(localId);
      
      if (!file)
        throw new Error("File not found");

      setMedia(prev => prev.map(fileUpload => {
        if (fileUpload.local.id === localId) {
          fileUpload.status = "uploading";
        }
        return fileUpload;
      }));

      const formDataPayload = new FormData();
      formDataPayload.append("file", file);

      const { data } = initialData
        ? await api.post(`/gallery/posts/${initialData.postId}/media`, formDataPayload)
        : await api.post("/gallery/media", formDataPayload);

      return { localId, media: data.data }
    },

    onSuccess: ({ localId, media }) => {
      setMedia(prev => prev.map(fileUpload => {
        if (fileUpload.local.id === localId) {
          fileUpload.status = "ready";
          fileUpload.remote = {
            id: media.id,
            url: media.secureUrl
          }
        }
        return fileUpload;
      }));

      if (!value) return;
      onChange?.({
        ids: [...value.ids, media.id],
        coverId: value.coverId ?? media.id
      });

      if(initialData)
        queryClient.invalidateQueries({  queryKey: ["posts", initialData.postId] });
    },

    onError: (error, localId) => {
      setMedia(prev => prev.map(fileUpload => {
        if (fileUpload.local.id === localId) {
          fileUpload.status = "failed";

          return fileUpload;
        }

        return fileUpload;
      }));
      
      toast.error(getErrorMessage(error));
    }
  });

  async function handleUploadMedia(localId: string) {
    uploadMutation.mutate(localId);
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
        <div className="h-30 rounded-lg border border-dashed border-border bg-surface focus:border-accent-primary">
          <label className="flex flex-col justify-center items-center gap-1.5 h-full w-full font-sans text-[11px] text-foreground-secondary">
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
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg border border-border bg-surface">
          {media.map(file => (
            <div
              key={file.remote?.id ?? file.local.id}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden duration-200 border border-transparent",
                (value?.coverId && file.remote?.id === value.coverId) && "border-accent-primary"
              )}
            >
              <CldImage
                src={file.remote?.url ?? file.local.url}
                alt={`file-${file.remote?.id ?? "unknown"}`}
                className="h-full w-full object-cover"
                fill
                sizes="25vw"
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
                    {(value?.coverId && file.remote.id === value.coverId) && <div className="absolute bottom-2 right-2 flex gap-1 items-center py-1 px-2 rounded-sm font-sans text-xs text-surface-2 bg-accent-primary">
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