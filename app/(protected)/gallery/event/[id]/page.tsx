"use client"

import { LoadingState } from "@/features/common/components/LoadingState";
import { useModal } from "@/features/common/hooks/useModal";
import { PostVisibility } from "@/shared/constants/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEventFormModal } from "@/features/events/hooks/useEventFormModal";
import { eventsService } from "@/features/events/services/event.service";

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { confirm } = useModal();
  const { openEditEventModal } = useEventFormModal();

  const id = params.id;

  if (typeof id !== "string") {
    return <></>
  }
  
  const eventQuery = useQuery({
    queryKey: ["events", params.id],
    queryFn: () => eventsService.getEventById(id)
  });

  const deleteEventMutation = useMutation({
    mutationFn: eventsService.deleteEventById,
    onSuccess: () => router.replace("/gallery"),
  });

  async function handleDelete(id: string) {
    const confirmedDelete = await confirm({
      title: "Delete Event?",
      message: "Are you sure you want to delete this event?",
      variant: "danger",
    });

    if (confirmedDelete)
      deleteEventMutation.mutate(id);
  }

  const visibility = {
    [PostVisibility.ADMIN_ONLY]: "Admin Only",
    [PostVisibility.PUBLIC]: "Public",
    [PostVisibility.PRIVATE]: "Private",
  }

  const isLoading = eventQuery.isLoading;
  const eventData = eventQuery.data?.data;

  if (isLoading) {
    return <LoadingState />
  }

  if (eventData) {
    return (
      <section className="flex-1">
        <div className="flex gap-1.5 mb-3.5 text-[10px]">
          <span className="text-text-2">Gallery</span>
          <span className="">{eventData.title}</span>
        </div>
        <div className="flex justify-between items-center text-[15px] mb-4">
          <div className="font-bold">
            {eventData.title}
          </div>
          <div className="flex gap-1.5 text-[10px]">
            <button className="py-2 px-4 rounded-lg tracking-[0.6px] border border-border-2 bg-surface-tertiary">DOWNLOAD</button>
            <button
              className="py-2 px-4 rounded-lg tracking-[0.6px] border border-border-2 bg-surface-tertiary"
              onClick={() => {
                openEditEventModal({
                  id: eventData.id,
                  title: eventData.title,
                  description: eventData.description,
                  visibility: eventData.visibility,
                  dateOfMoment: eventData.dateOfMoment,
                  categoryId: eventData.category?.id,
                  tags: eventData.tags,
                  coverMedia: eventData.coverMedia,
                  media: eventData.media,
                })
              }}
            >
              EDIT
            </button>
            <button
              className="py-2 px-4 rounded-lg tracking-[0.6px] border border-accent-danger bg-accent-danger/15 text-accent-danger"
              onClick={() => handleDelete(eventData.id)}
            >DELETE</button>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="relative w-50 h-40">
            {
              eventData.coverMedia && <CldImage
                className="w-full h-full object-cover rounded-lg overflow-hidden"
                src={eventData.coverMedia.secureUrl}
                alt=""
                fill
                sizes="25vw"
              />
            }
          </div>
          <div className="flex-1 text-[11px]">
            <p className="font-sans text-text-2 mb-3">{eventData.description}</p>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-[9px] tracking-[0.6px] text-text-3">CATEGORY</span>
                <span className="py-0.5 px-1.75 rounded-[3px] text-[9px] text-accent-primary bg-accent-primary/10">{eventData.category?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] tracking-[0.6px] text-text-3">DATE</span>
                <span className="rounded-[3px] text-[10px] text-text-2">{dayjs(eventData.dateOfMoment).format("YYYY-MM-DD")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] tracking-[0.6px] text-text-3">UPLOADED BY</span>
                <span className="rounded-[3px] font-sans text-[11px] text-text-2">{eventData.uploadedByUser?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] tracking-[0.6px] text-text-3">VISIBILITY</span>
                <span className="rounded-[3px] font-sans text-[11px] text-accent-info">{visibility[eventData.visibility as PostVisibility]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] tracking-[0.6px] text-text-3">TAGS</span>
                <span className="rounded-[3px] font-sans text-[10px] text-text-3">
                  {eventData.tags?.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-5 rounded-lg bg-surface-primary">
          <div className="text-[12px] mb-2 text-text-2">ALL IMAGES</div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {eventData.media.map((media: any) =>
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

}

export default EventDetailPage;