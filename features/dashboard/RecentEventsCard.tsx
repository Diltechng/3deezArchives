"use client"

import { RecentEventItemCard, RecentEventItemCardSkeleton } from "@/features/dashboard/RecentEventItemCard";
import Button from "@/features/common/ui/Button";
import { NoEvent } from "@/features/common/ui/icons/NoEvent";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useEventFormModal } from "../events/hooks/useEventFormModal";
import { useQuery } from "@tanstack/react-query";
import { eventsService } from "../events/services/event.service";

export const RecentEventsCard = () => {
  const { openAddEventModal } = useEventFormModal();

  const recentEventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => eventsService.getEvents({ limit: 5, page: 1 }),
  });


  const recentEvents = recentEventsQuery.data?.data ?? [];
  const isLoading = recentEventsQuery.isLoading;
  const isError = recentEventsQuery.isError;

  return (
    <div className="py-5 rounded-lg border border-border bg-surface">
      <div className="px-4 mb-2 flex justify-between items-center">
        <div className="text-sm font-semibold">
          Recent Events
        </div>
        <Link href="/gallery" className="text-xs text-accent-secondary">
          View all events <ArrowRight className="inline w-3.25 h-3.25" />
        </Link>
      </div>
      <div className="px-4 flex flex-col">
        {isLoading
          ? <>
            <RecentEventItemCardSkeleton />
            <RecentEventItemCardSkeleton />
            <RecentEventItemCardSkeleton />
          </>
          : recentEvents.length
            ? recentEvents.map((event: any, i: number) => (
              <RecentEventItemCard key={event.id} event={event} className={{"border-none": (i === (recentEvents.length - 1))}} />
            ))
          : (
            <div className="flex flex-col items-center text-center mt-4 mb-2">
              <NoEvent className="w-full max-w-50 aspect-video" />
              <p className="mb-2 text-lg font-bold">No Events Yet</p>
              <p className="max-w-80 text-sm mb-4 text-foreground-secondary">Get started by adding your first event to build your organization's archive.</p>
              <Button className="w-fit gap-1 font-medium px-4" onClick={openAddEventModal}>
                <Plus className="w-4.5 h-4.5" />
                <span>
                  Add Your First Event
                </span>
              </Button>
            </div>
          )
        }
      </div>
    </div>
  )
}