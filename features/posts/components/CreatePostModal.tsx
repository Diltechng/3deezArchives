import BackgroundOverlay from "@/features/shared/components/BackgroundOverlay";
import { Field, Label } from "@/features/shared/components/Input";
import { PostVisibility } from "@/shared/constants/enums";
import { AlertCircle, RefreshCw, Star, Trash2, Upload, XCircle, X as XDelete } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GalleryCategory, MediaUploadItem } from "../types";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostInput, CreatePostSchema, UploadMediaSchema } from "@/shared/schemas";
import { cn } from "@/features/shared/lib/utils";
import Loader from "@/features/shared/components/Loader";
import { useAuthFetch } from "@/features/auth/hooks/useAuthFetch";
import { toast } from "react-toastify";
import z from "zod";
import { useRouter } from "next/navigation";

const CreatePostModal = ({ categories, onExit }: {
  categories: GalleryCategory[]
  onExit?: () => any;
}) => {
  const authFetch = useAuthFetch();
  const router = useRouter();
  const [tagInput, setTagInput] = useState("");
  const [media, setMedia] = useState<MediaUploadItem[]>([]);
  
  const fileCacheRef = useRef<Map<string, File>>(new Map());

  const { watch, getValues, setValue, resetField, register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      tags: [],
      mediaIds: [],
    }
  });

  const tags = watch("tags");
  const coverMediaId = watch("coverMediaId");

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

      const response = await authFetch("/api/v1/gallery/media", {
        method: "POST",
        body: formDataPayload
      });

      const result = await response.json();

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

      setValue("mediaIds", [...getValues("mediaIds"), result.data.id]);


      console.log(getValues("coverMediaId"));
      if (!getValues("coverMediaId"))
        setAsCover(result.data.id);

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
    console.log("Hi")
    const files = Array.from(e.target.files ?? []);
                    
    if (!files.length) return;

    files.forEach(async file => {
      console.log(file);
      
      const result = UploadMediaSchema.safeParse({ file });

      if (!result.success) {
        const parsedErrors = z.flattenError(result.error).fieldErrors.file;
        console.log(parsedErrors);
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
    if (!remoteId) return;
    
    setMedia(prev => prev.filter(fileUpload => fileUpload.remote?.id !== remoteId));
    setValue("mediaIds", getValues("mediaIds").filter(mediaId => mediaId !== remoteId));
    if (remoteId === getValues("coverMediaId"))
      resetField("coverMediaId");
  }

  function addTag() {
    const value = tagInput.trim();
    if (!value) return;

    const currentTags = tags || [];

    if (currentTags.includes(value)) {
      setTagInput("");
      return;
    }

    setValue("tags", [...currentTags, tagInput]);
    setTagInput("");
  }

  function setAsCover(remoteId: string | undefined) {
    if (!remoteId) return;
    
    setValue("coverMediaId", remoteId);
  }

  async function onSubmit(data: CreatePostInput) {
    try {
      const response = await authFetch("/api/v1/gallery/posts", {
        method: "POST",
        body: JSON.stringify(data)
      });

      const body = await response.json();
      if (!body.success) {
        toast.error(body.error.message);
        return;
      }

      if (onExit) onExit();
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  }

  useEffect(() => {
    return () => media.forEach(fileUpload => 
      URL.revokeObjectURL(fileUpload.local.url)
    );
  }, []);

  return (
    <BackgroundOverlay>
      <form
        className="flex flex-col m-auto h-full w-full max-w-170 py-6 rounded-2xl shadow-lg border border-border bg-background"
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4 px-6">
          <h1 className="font-bold text-[18px] tracking-[0.02rem]">Upload Images</h1>
          <p className="mt-0.5 font-sans text-[11px] text-text-3">Add a moment to the archives</p>
        </div>
        <div className="px-6 overflow-x-auto">
          <div className="flex flex-col gap-5 mb-4 p-5 rounded-lg bg-surface">
            <Field>
              <Label htmlFor="images">IMAGE FILE</Label>
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
              {errors.mediaIds && <p className="ml-2 text-[11px] text-red-400">{"* " + errors.mediaIds.message}</p>}
            </Field>
            {media.length !== 0 &&
              <div className="p-4 grid grid-cols-3 lg:grid-cols-4 gap-4 rounded-lg border border-border-2 bg-surface-3">
                {media.map(file => (
                  <div
                    key={file.local.id}
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden duration-200 border border-transparent",
                      (file.remote?.id === coverMediaId) && "border-accent"
                    )}
                  >
                    <img
                      src={file.local.url}
                      className="h-full w-full object-cover"
                    />
                    {(file.status === "uploading")
                      ? (
                        <div className="absolute top-0 flex p-2 h-full w-full duration-200 bg-linear-to-t from-black/90 via-black/50 to-black/20">
                          <Loader />
                        </div>
                      ) : (file.status === "ready" && file.remote)
                      ? (
                        <>
                          <div className="absolute top-0 p-2 h-full w-full duration-200 opacity-0 hover:opacity-100 bg-linear-to-t from-black/60 via-black/20 to-transparent">
                            {!(file.remote.id === coverMediaId) && <div className="flex justify-end gap-1 h-7">
                              <button
                                className="p-1 aspect-square rounded-sm border border-border-2 bg-surface-3"
                                type="button"
                                onClick={() => setAsCover(file.remote?.id)}
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
                          {(file.remote.id === coverMediaId) && <div className="absolute bottom-2 right-2 flex gap-1 items-center py-1 px-2 rounded-sm font-sans text-xs text-surface-2 bg-accent">
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
          </div>
          <div className="flex flex-col gap-4 p-5 rounded-lg bg-surface">
            <div>

            </div>
            <Field>
              <Label>TITLE</Label>
              <input
                className="input-core"
                {...register("title")}
                id="title"
                placeholder="eg. Studio Session Vol.4"
              />
              {errors.title && <p className="ml-2 text-[11px] text-red-400">{"* " + errors.title.message}</p>}
            </Field>
            <Field>
              <Label>DESCRIPTION</Label>
              <textarea
                {...register("description")}
                className="input-core resize-none flex-1 min-w-0 h-100"
                placeholder="Describe this moment."
              />
              {errors.description && <p className="ml-2 text-[11px] text-red-400">{"* " + errors.description.message}</p>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label>CATEGORY</Label>
                <select {...register("categoryId")} className="input-core">
                  <option>-- Select a category --</option>
                  {categories && categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="ml-2 text-[11px] text-red-400">{"* " + errors.categoryId.message}</p>}
              </Field>
              <Field>
                <Label>DATE OF MOMENT</Label>
                <input
                  {...register("dateOfMoment")}
                  className="input-core"
                  type="date"
                />
                {errors.dateOfMoment && <p className="ml-2 text-[11px] text-red-400">{"* " + errors.dateOfMoment.message}</p>}
              </Field>
              <Field>
                <Label>TAGS</Label>
                <div className="input-core flex-wrap">
                  {tags.length
                    ? <div className="flex gap-0.5 flex-wrap">
                      {tags.map(tag => (
                        <div key={tag} className="flex gap-1 items-center border border-border-2 py-0.5 px-2 rounded-[3px] bg-surface">
                          <span>{tag}</span>
                          <button onClick={() => setValue("tags", tags.filter(storedTag => storedTag !== tag))}>
                            <XDelete className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    : <></>
                  }
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="eg. Minna, 2026, Studio"
                    className="flex-1 min-w-20"
                  />
                </div>
              </Field>
              <Field>
                <Label htmlFor="">VISIBILITY</Label>
                <select {...register("visibility")} className="input-core">
                  <option>-- Choose --</option>
                  {[{
                    name: "Public",
                    value: PostVisibility.PUBLIC
                  }, {
                    name: "Admin Only",
                    value: PostVisibility.ADMIN_ONLY
                  }, {
                    name: "Private",
                    value: PostVisibility.PRIVATE
                  }].map(option => (
                    <option key={option.value} value={option.value}>{option.name}</option>
                  ))}
                </select>
                {errors.visibility && <p className="ml-2 text-[11px] text-red-400">{"* " + errors.visibility.message}</p>}
              </Field>
            </div>
          </div>
        </div>
        <div className="flex gap-2 px-6 pt-3 justify-end mt-auto">
          <button
            type="button"
            className="button-ghost"
            onClick={onExit}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button-primary"
          >
            Upload
          </button>
        </div>
      </form>
    </BackgroundOverlay>
  )
}

export default CreatePostModal;