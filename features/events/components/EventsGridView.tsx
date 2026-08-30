import { CldImage } from "next-cloudinary"
import { GalleryEvent } from "../types"
import dayjs from "dayjs"
import Link from "next/link"

const EventCardSkeleton = () => (
  <div
    className="flex flex-col overflow-hidden rounded-lg border border-border-primary"
  >
    <div className="relative w-full aspect-square animate-shimmer bg-shimmer">
    </div>
    <div className="flex flex-col flex-1 gap-1 p-2.5 border-t border-border-primary bg-surface-primary">
      <p className="h-4 rounded-[3px] text-[11px] font-sans truncate animate-shimmer bg-shimmer" />
      <p className="h-4 rounded-[3px] text-[10px] text-text-3 animate-shimmer bg-shimmer" />
      <div className="flex gap-2 justify-between">
        <div className="h-4 w-20 py-0.5 px-1.75 rounded-[3px] text-[9px] truncate border animate-shimmer border-border-2/20 text-accent-info bg-shimmer" />
        <div className="h-4 w-12 text-[10px] font-sans truncate rounded-[3px] border animate-shimmer bg-shimmer border-border-2/20 text-text-3" />
      </div>
    </div>
  </div>
);

const EventCard = ({ event }: {
  event: GalleryEvent;
}) => (
  <Link
    href={`/gallery/event/${event.id}`}
    className="flex flex-col overflow-hidden rounded-lg border border-border-primary"
  >
    <div className="relative w-full aspect-square">
      <CldImage
        className="w-full h-full object-cover"
        src={event?.coverMedia?.secureUrl ?? ""}
        alt=""
        fill
        sizes="25vw"
      />
    </div>
    <div className="flex flex-col gap-1 p-2.5 border-t border-border-primary bg-surface-primary">
      <p className="text-[11px] font-sans truncate">{event.title}</p>
      <p className="text-[10px] text-text-3">{dayjs(event.dateOfMoment).format("YYYY-MM-DD")}</p>
      <div className="flex gap-2 justify-between">
        <div className="py-0.5 px-1.75 rounded-[3px] text-[9px] truncate text-accent-info bg-accent-info/20">{event?.category?.name}</div>
        <div className="text-[10px] font-sans truncate text-text-3">{event?.uploadedByUser?.name}</div>
      </div>
    </div>
  </Link>
);

export const EventsGridView = ({ isLoading, events }: {
  isLoading?: boolean;
  events: GalleryEvent[] | undefined;
}) => {
  if (!isLoading && !events?.length) {
    return <div>No Events.</div>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {isLoading
        ? [...Array(3)].map((_, i) => <EventCardSkeleton key={i} />)
        : events?.length
          ? events.map(event => <EventCard key={event.id} event={event} />)
          : ""
      }
    </div>
 )
}