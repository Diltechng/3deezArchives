"use client"

import { useAuthFetch } from "@/features/auth/hooks/useAuthFetch";
import Loader from "@/features/shared/components/Loader";
import { PostVisibility } from "@/shared/constants/enums";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const PostDetailPage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const authFetch = useAuthFetch();
  const params = useParams();
  const router = useRouter();
  
  const { isLoading, data } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const response = await authFetch(`/api/v1/gallery/posts/${params.id}`);

      return await response.json();
    }
  });

  async function handleDelete(id: string) {
    const response = await authFetch(`/api/v1/gallery/posts/${params.id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    
    router.replace("/gallery");
  }

  const visibility = {
    [PostVisibility.ADMIN_ONLY]: "Admin Only",
    [PostVisibility.PUBLIC]: "Public",
    [PostVisibility.PRIVATE]: "Private",
  }

  if (isLoading) {
    return (
      <div className="flex flex-1">
        <Loader />
      </div>
    )
  }

  console.log(data);

  return (
    <section className="flex-1">
      {showDeleteModal && (
        <div className="fixed flex flex-col p-8 top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/20">
          <div className="flex flex-col gap-4 m-auto rounded-xl border border-border-2 bg-surface py-6 px-6">
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end gap-4 text-[13px]">
              <button
                className="py-2 px-3 rounded-md text-text-2 bg-surface-3/40 hover:bg-surface-3 hover:text-text"
                onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="py-2 px-3 rounded-md text-accent-2 bg-accent-2/10 hover:bg-accent-2/20"
                onClick={() => handleDelete(data.data.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
          <button className="py-2 px-4 rounded-lg tracking-[0.6px] border border-border-2 bg-surface-3">EDIT</button>
          <button
            className="py-2 px-4 rounded-lg tracking-[0.6px] border border-accent-2 bg-accent-2/15 text-accent-2"
            onClick={() => setShowDeleteModal(true)}
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
              <span className="py-0.5 px-1.75 rounded-[3px] text-[9px] text-accent bg-accent/10">{data.data.category.name}</span>
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
              <span className="rounded-[3px] font-sans text-[11px] text-accent-3">{visibility[data.data.visibility as PostVisibility]}</span>
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