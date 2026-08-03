"use client"

import { RecentEventItemCard, RecentEventItemCardSkeleton } from "@/features/dashboard/RecentEventItemCard";
import { StatCard, StatCardSkeleton } from "@/features/dashboard/StatCard";
import { useEventFormModal } from "@/features/posts/hooks/useEventFormModal";
import PageHeader from "@/features/shared/components/PageHeader"
import { api } from "@/features/shared/lib/api";
import Button from "@/features/shared/ui/Button";
import { NoEvent } from "@/features/shared/ui/icons/NoEvent";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, CalendarClock, FolderOpen, Plus, UsersRound } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  const { isLoading: isLoadingStats, data: statsData } = useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");

      return response.data;
    }
  });

  const { user } = useCurrentUser();
  const { openAddEventModal } = useEventFormModal();

  return (
    <section>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}.`}
        subtitle="A living record of the moments that made 3Deez Global Group."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-3 mb-3 md:mb-5">
        {isLoadingStats
          ? <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
          : statsData?.data
            ? <>
                <StatCard
                  Icon={Calendar}
                  label="Total Events"
                  value={`${statsData.data.totalPosts ?? "-"}`}
                  href="/gallery"
                  linkName="View all events"
                />
                <StatCard
                  Icon={UsersRound}
                  label="Total Members"
                  value={`${statsData.data.totalUsers ?? "-"}`}
                  accent="secondary"
                  href="/users"
                  linkName="View all members"
                />
                <StatCard
                  Icon={CalendarClock}
                  label="This Month"
                  value={`${statsData.data.totalPostsThisMonth ?? "-"}`}
                  href="/gallery"
                  linkName="View events"
                />
                <StatCard
                  Icon={FolderOpen}
                  label="Categories"
                  value={`${statsData.data.totalCategories ?? "-"}`}
                  accent="secondary"
                  href="#"
                  linkName="View all categories"
                />
              </>
            : <></>
        }
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="overflow-hidden py-5 rounded-lg border border-border bg-surface">
          <div className="px-4 mb-2 flex justify-between items-center">
            <div className="text-sm font-semibold">
              Recent Events
            </div>
            <Link href="/gallery" className="text-xs text-accent-secondary">
              View all events <ArrowRight className="inline w-3.25 h-3.25" />
            </Link>
          </div>
          <div className="px-4 flex flex-col">
            {isLoadingStats
              ? <>
                <RecentEventItemCardSkeleton />
                <RecentEventItemCardSkeleton />
                <RecentEventItemCardSkeleton />
              </>
              : statsData?.data?.recentPosts?.length
                ? statsData.data.recentPosts.map((post: any, i: number) => (
                  <RecentEventItemCard key={post.id} post={post} className={{"border-none": (i === (statsData.data.recentPosts.length - 1))}} />
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
      </div>
    </section>
  )
}

export default HomePage;
