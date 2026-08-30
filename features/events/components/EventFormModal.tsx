import { PostVisibility } from "@/shared/constants/enums";
import { Calendar, X as XDelete } from "lucide-react";
import { useState } from "react";
import { EventFormInitialData } from "../types";
import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostInput, CreatePostSchema } from "@/shared/schemas";
import { toast } from "react-toastify";
import { api } from "@/features/common/lib/api";
import { FormField } from "@/features/common/components/FormField";
import { FormFieldCard } from "@/features/common/components/FormFieldCard";
import { EventMediaField } from "./EventMediaField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/features/common/components/Modal";
import { ModalHeader } from "@/features/common/components/ModalHeader";
import { ModalFooter } from "@/features/common/components/ModalFooter";
import { Button } from "@/features/common/ui/Button";
import { ModalBody } from "@/features/common/components/ModalBody";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { Input } from "@/features/common/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/common/ui/Select";
import { Textarea } from "@/features/common/ui/Textarea";
import { getErrorMessage } from "@/features/common/lib/utils";

interface EventFormModalProps {
  title: string;
  subtitle?: string;
  onClose?: () => any;
  initialData?: EventFormInitialData;
}

export const EventFormModal = ({ title, subtitle, onClose, initialData }: EventFormModalProps) => {
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async (data: CreatePostInput) => {
      if (initialData) {
        const response = await api.patch(`/gallery/posts/${initialData.id}`, data);

        return response;
      }

      const response = await api.post("/gallery/posts", data);

      return await response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      
      if (onClose) onClose();
    },
    onError: (error: any) => {
      toast.error(getErrorMessage(error));
    }
  });
  
  const { data: categoriesData } = useCategories();
  console.log(categoriesData);

  const [tagInput, setTagInput] = useState("");

  const { watch, setValue, register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description,
      dateOfMoment: initialData?.dateOfMoment ?? new Date().toISOString().split("T")[0],
      categoryId: initialData?.categoryId,
      visibility: initialData?.visibility,
      tags: initialData?.tags ?? [],
      media: {
        ids: initialData?.media.map(media => media.id) ?? [],
        coverId: initialData?.coverMedia.id
       }
    }
  });

  const tags = watch("tags");
  
  const {
    field: visibiliyField,
    fieldState: visibilityState,
  } = useController({ name: "visibility", control });
  const {
    field: categoryField,
    fieldState: categoryState,
  } = useController({ name: "categoryId", control, });

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
  }

  return (
    <Modal>
      <ModalHeader title={title} subtitle={subtitle} />
      <ModalBody>
        <form id="event-form" className="flex-1 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormFieldCard title="Image File">
            <EventMediaField
              value={media}
              initialData={initialData && {
                eventId: initialData.id,
                media: initialData.media
              }}
              onChange={(next) => setValue("media", next)}
              error={errors.media?.ids ?? errors.media?.coverId}
            />
          </FormFieldCard>
          <FormFieldCard title="Image Details" className="[&>div]:sm:grid-cols-2">
            <FormField label="Title" error={errors.title} className="sm:col-span-2">
              <Input
                {...register("title")}
                id="title"
                placeholder="eg. Studio Session Vol.4"
              />
            </FormField>
            <FormField label="Description" error={errors.description} className="sm:col-span-2">
              <Textarea
                {...register("description")}
                className="resize-none min-w-0 h-30"
                placeholder="Describe this moment."
              />
            </FormField>
            <FormField label="Category" error={errors.categoryId}>
              <Select
                value={categoryField.value}
                onValueChange={categoryField.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.data && categoriesData?.data?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Date of Moment" error={categoryState.error}>
              <div className="relative flex items-center">
                <Input
                  className="calendar-indicator-none w-full"
                  {...register("dateOfMoment")}
                  type="date"
                />
                <Calendar className="absolute w-4 h-4 right-3 pointer-events-none" />
              </div>
            </FormField>
            <FormField label="Tags" error={errors.tags}>
              <div className="p-2.25 flex flex-wrap gap-1 text-sm rounded-lg duration-200 border border-border-primary bg-surface-primary focus-within:border-accent-primary">
                {tags.length
                  ? <div className="flex gap-1 flex-wrap">
                    {tags.map(tag => (
                      <div key={tag} className="flex gap-1 items-center border border-border-secondary py-0.5 px-2 rounded-[3px] bg-surface-primary">
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
            <FormField label="Visibility" error={visibilityState.error}>
              <Select value={visibiliyField.value} onValueChange={visibiliyField.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a visibility" />
                </SelectTrigger>
                <SelectContent>
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
                    <SelectItem key={option.value} value={option.value}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormFieldCard>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button form="event-form" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}