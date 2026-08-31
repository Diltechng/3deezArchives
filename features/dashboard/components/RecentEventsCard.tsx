"use client"

import { RecentEventItemCard, RecentEventItemCardSkeleton } from "@/features/dashboard/components/RecentEventItemCard";
import { Button } from "@/features/common/ui/Button";
import { NoEvent } from "@/features/common/ui/icons/NoEvent";
import { AlertCircle, ArrowRight, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEventFormModal } from "../../events/hooks/useEventFormModal";
import { useQuery } from "@tanstack/react-query";
import { eventsService } from "../../events/services/event.service";
import { Card } from "../../common/ui/Card";

interface ErrorStateProps {
  onRetry?: () => void;
  errorMessage?: string;
}

export const RecentEventsErrorState: React.FC<ErrorStateProps> = ({
  onRetry,
  errorMessage = "We couldn't retrieve your recent events. Please check your connection or try again.",
}) => {
  return (
    // Main Error Container
    <Card className="w-full p-12 flex flex-col items-center justify-center text-center min-h-100">
      {/* Icon container */}
      <div className="w-16 h-16 rounded-full bg-accent-danger/10 border border-accent-danger/20 flex items-center justify-center mb-5 text-accent-danger">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-semibold text-foreground-primary mb-2">
        Failed to load recent events
      </h2>
      <p className="text-sm text-foreground-secondary max-w-md mb-8 leading-relaxed">
        {errorMessage}
      </p>

      {/* Action Controls */}
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 bg-accent-primary hover:bg-accent-primary text-background font-semibold text-sm rounded-lg transition-colors cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </Card>
  );
};


export const RecentEventsCard = () => {
  const { openAddEventModal } = useEventFormModal();

  const recentEventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => eventsService.getEvents({ limit: 5, page: 1 }),
  });


  const recentEvents = recentEventsQuery.data?.data ?? [];
  const isLoading = recentEventsQuery.isLoading;
  const isError = recentEventsQuery.isError;
  const refetch = recentEventsQuery.refetch;

  if (isError) {
    return <RecentEventsErrorState onRetry={() => refetch()} />
  }

  return (
    <Card className="py-5">
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
            <RecentEventItemCardSkeleton count={3} />
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
    </Card>
  )
}