import { accentFadedCn, accentFromName, accentTextCn, cn } from "@/features/common/lib/utils";
import { Button } from "@/features/common/ui/Button";
import { ClassValue } from "clsx";
import dayjs from "dayjs";
import { EllipsisVertical, Image, Info, Pencil, Trash2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useModal } from "../../common/hooks/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "../../events/services/event.service";
import { useEventFormModal } from "../../events/hooks/useEventFormModal";
import { DropdownMenu, DropdownMenuArrow, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../common/ui/Dropdown";
import { Skeleton } from "../../common/ui/Skeleton";


export const RecentEventItemCardSkeleton = ({ count=1 }) => (
  Array.from({ length: count }).map((_, i) =>  (
    <div key={i} className={cn(
      "py-2.5 flex items-center justify-between text-sm border-b border-border-primary",
      {"border-none": (i === (count - 1))}
    )}>
      <div className="flex gap-2 items-center">
        <Skeleton className="shrink-0 w-20 h-15 rounded-lg" />
        <div className="grid gap-1">
          <div className="flex flex-col md:flex-row gap-1 items-start md:items-center">
            <Skeleton className="h-4 w-60" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-3 w-50" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="px-2">
        <Skeleton className="h-8 w-4" />
      </div>
    </div>
  ))
);

export const RecentEventItemCard = ({ event, className }: {
  event: any;
  className?: ClassValue;
}) => {
  const { confirm } = useModal();
  const { openEditEventModal } = useEventFormModal();
  const queryClient = useQueryClient();

  const deleteEventMutation = useMutation({
    mutationFn: eventsService.deleteEventById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"]
      });
    }
  });

  const handleDeleteEvent = async (id: string) => {
    const confirmedDelete = await confirm({
      title: "Delete Event?",
      message: "Are you sure you want to delete this event?",
      variant: "danger",
    });

    if (confirmedDelete)
      deleteEventMutation.mutate(id);
  }

  return (
    <div className={cn(
      "py-2.5 flex items-center justify-between text-sm border-b border-border-primary",
      className
    )}>
      <Link href={`/gallery/event/${event.id}`} className="flex gap-2 items-center">
        <div className="relative shrink-0 w-20 h-15 overflow-hidden rounded-lg">
          <CldImage
            src={event.coverMedia.secureUrl}
            alt={event.title}
            sizes="20vw"
            className="object-cover"
            fill
          />
        </div>
        <div className="grid gap-1 font-sans text-foreground-secondary">
          <div className="flex flex-col md:flex-row gap-1 items-start md:items-center text-foreground-primary truncate">
            {event.title}
            <div
              className={cn(
                accentTextCn(accentFromName(event.category.name)),
                accentFadedCn(accentFromName(event.category.name)),
                "inline-block px-1 py-0.5 rounded-sm text-[10px] truncate"
              )}
            >
              {event.category.name}
            </div>
          </div>
          <span className="text-xs">
            {`${dayjs(event.createdAt).format("MMMM DD, YYYY")} · ${event.uploadedByUser.name}`}
          </span>
          <div className="text-xs">
            <div className="flex gap-1 items-center">
              <Image className="w-3.5 h-3.5" />
              {event.media.length}
            </div>
          </div>
        </div>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 text-foreground-secondary">
            <EllipsisVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Button variant="text" className="text-xs hover:bg-surface-secondary" asChild>
              <Link href={`/gallery/event/${event.id}`}>
                <Info className="w-4 h-4" />
                View Details
              </Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="text"
              className="text-xs hover:bg-surface-secondary"
              onClick={() => openEditEventModal({
                id: event.id,
                title: event.title,
                description: event.description,
                visibility: event.visibility,
                dateOfMoment: event.dateOfMoment,
                categoryId: event.category?.id,
                tags: event.tags,
                coverMedia: event.coverMedia,
                media: event.media,
              })}
            >
              <Pencil className="w-4 h-4" />
              Edit Event
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              variant="text"
              className="text-xs text-accent-danger hover:text-accent-danger hover:bg-accent-danger/10"
              onClick={async () => await handleDeleteEvent(event.id)}
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </Button>
          </DropdownMenuItem>
          <DropdownMenuArrow className="fill-border-primary" />
          <DropdownMenuArrow className="relative -top-0.5" />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}