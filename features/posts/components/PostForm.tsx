import { PostVisibility } from "@/shared/constants/enums";
import { X as XDelete } from "lucide-react";
import { useState } from "react";
import { GalleryCategory } from "../types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostInput, CreatePostSchema } from "@/shared/schemas";
import { toast } from "react-toastify";
import { api } from "@/features/shared/lib/api";
import { CancelButton, SubmitButton } from "@/features/shared/components/FormModal";
import FormField from "@/features/shared/components/FormField";
import FormFieldCard from "@/features/shared/components/FormFieldCard";
import PostMediaField from "./PostMediaField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const PostForm = ({ categories, onClose, initialData }: {
  categories?: GalleryCategory[]
  onClose?: () => any;
  initialData?: {
    title: string;
    description: string;
    visibility: PostVisibility;
    dateOfMoment: string;
    categoryId: string;
    tags: string[];
    media: {
      ids: string;
      coverId: string;
    }
  };
}) => {
  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      const response = await api.post("/gallery/posts", data);

      return await response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      if (onClose) onClose();
    },
    onError: (error: any) => {
      const message = (axios.isAxiosError(error))
        ? error.response?.data?.error?.message
        : error?.message ||
        "Something went wrong. Please try again";
      
      toast.error(message);
    }
  });

  const [tagInput, setTagInput] = useState("");

  console.log(categories);

  const { watch, setValue, register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description,
      dateOfMoment: initialData?.dateOfMoment,
      categoryId: initialData?.categoryId,
      visibility: initialData?.visibility,
      tags: initialData?.tags ?? [],
      media: { ids: [] }
    }
  });

  const tags = watch("tags");

  const media = useWatch({
    control,
    name: "media"
  });

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

  function onSubmit(data: CreatePostInput) {
    uploadMutation.mutate(data);
    uploadMutation.isError
  }

  return (
    <form className="flex-1 flex flex-col overflow-hidden" onSubmit={handleSubmit(onSubmit)} >
      <div className="h-full overflow-x-auto">
        <FormFieldCard title="Image File">
          <PostMediaField
            value={media}
            onChange={(next) => setValue("media", next)}
            error={errors.media?.ids ?? errors.media?.coverId}
          />
        </FormFieldCard>
        <FormFieldCard title="Image Details" columns={2}>
          <FormField label="Title" error={errors.title} className="col-span-2">
            <input
              className="input-core"
              {...register("title")}
              id="title"
              placeholder="eg. Studio Session Vol.4"
            />
          </FormField>
          <FormField label="Description" error={errors.description} className="col-span-2">
            <textarea
              {...register("description")}
              className="input-core resize-none flex-1 min-w-0 h-100"
              placeholder="Describe this moment."
            />
          </FormField>
          <FormField label="Category" error={errors.categoryId}>
            <select {...register("categoryId")} className="input-core">
              <option>-- Select a category --</option>
              {categories && categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Date of Moment" error={errors.dateOfMoment}>
            <input
              {...register("dateOfMoment")}
              className="input-core"
              type="date"
            />
          </FormField>
          <FormField label="Tags" error={errors.tags}>
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
          </FormField>
          <FormField label="Visibility" error={errors.visibility}>
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
          </FormField>
        </FormFieldCard>
      </div>
      <div className="flex gap-2 px-6 pt-3 justify-end mt-auto">
        <CancelButton onClick={onClose} />
        <SubmitButton disabled={isSubmitting} />
      </div>
    </form>
  )
}

export default PostForm;