"use client"

import { PostFormModal } from "@/features/posts/components/PostFormModal";
import LoadingState from "@/features/common/components/LoadingState";
import useModal from "@/features/common/hooks/useModal";
import { api } from "@/features/common/lib/api";
import { PostVisibility } from "@/shared/constants/enums";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();

  const { openFormModal, confirm } = useModal();
  
  const { isLoading, data } = useQuery({
    queryKey: ["posts", params.id],
    queryFn: async () => {
      const response = await api.get(`/gallery/posts/${params.id}`);

      return response.data;
    }
  });

  async function handleDelete(id: string) {
    const response = await api.delete(`/gallery/posts/${params.id}`);

    const data = response.data;
    
    router.replace("/gallery");
  }

  const visibility = {
    [PostVisibility.ADMIN_ONLY]: "Admin Only",
    [PostVisibility.PUBLIC]: "Public",
    [PostVisibility.PRIVATE]: "Private",
  }

  if (isLoading) {
    return (
      <LoadingState />
    )
  }

  return (
    <section className="flex-1">
      <div className="flex gap-1.5 mb-3.5 text-[10px]">
        <span className="text-text-2">Gallery</span>
        <span className="">{data.data.title}</span>
      </div>
      <div className="flex justify-between items-center text-[15px] mb-4">
        <div className="font-bold">
          {data.data.title}
        </div>
        <div className="flex gap-1.5 text-[10px]">
          <button className="py-2 px-4 rounded-lg tracking-[0.6px] border border-border-2 bg-surface-3">DOWNLOAD</button>
          <button
            className="py-2 px-4 rounded-lg tracking-[0.6px] border border-border-2 bg-surface-3"
            onClick={async () => {
              const response = await api.get("/gallery/categories");

              const categories = response.data.data;

              openFormModal(PostFormModal, {
                title: "Edit Post",
                initialData: {
                  id: data.data.id,
                  title: data.data.title,
                  description: data.data.description,
                  visibility: data.data.visibility,
                  dateOfMoment: data.data.dateOfMoment,
                  categoryId: data.data.category.id,
                  tags: data.data.tags,
                  coverMedia: data.data.coverMedia,
                  media: data.data.media,
                }
              }
            )}}
          >
            EDIT
          </button>
          <button
            className="py-2 px-4 rounded-lg tracking-[0.6px] border border-accent-danger bg-accent-danger/15 text-accent-danger"
            onClick={async () => {
              const confirmedDelete = await confirm({
                title: "Delete Event",
                message: "Are you sure you want to delete this post?",
                confirmLabel: "Delete",
                variant: "danger",
              });

              if (confirmedDelete) {
                handleDelete(data.data.id)
              }
            }}
          >DELETE</button>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <div className="relative w-50 h-40">
          <CldImage
              className="w-full h-full object-cover rounded-lg overflow-hidden"
              src={data.data.coverMedia.secureUrl}
              alt=""
              fill
              sizes="25vw"
            />
        </div>
        <div className="flex-1 text-[11px]">
          <p className="font-sans text-text-2 mb-3">{data.data.description}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[9px] tracking-[0.6px] text-text-3">CATEGORY</span>
              <span className="py-0.5 px-1.75 rounded-[3px] text-[9px] text-accent-primary bg-accent-primary/10">{data.data.category.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] tracking-[0.6px] text-text-3">DATE</span>
              <span className="rounded-[3px] text-[10px] text-text-2">{dayjs(data.data.dateOfMoment).format("YYYY-MM-DD")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] tracking-[0.6px] text-text-3">UPLOADED BY</span>
              <span className="rounded-[3px] font-sans text-[11px] text-text-2">{data.data.uploadedByUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] tracking-[0.6px] text-text-3">VISIBILITY</span>
              <span className="rounded-[3px] font-sans text-[11px] text-accent-info">{visibility[data.data.visibility as PostVisibility]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[9px] tracking-[0.6px] text-text-3">TAGS</span>
              <span className="rounded-[3px] font-sans text-[10px] text-text-3">
                {data.data.tags.join(", ")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 rounded-lg bg-surface">
        <div className="text-[12px] mb-2 text-text-2">ALL IMAGES</div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {data.data.media.map((media: any) =>
            <Link
              key={media.id}
              href={media.secureUrl}
              target="_blank"
              className="relative aspect-square"
            >
              <CldImage
                className="w-full h-full object-cover rounded-lg overflow-hidden"
                src={media.secureUrl}
                alt=""
                fill
                sizes="25vw"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default PostDetailPage;