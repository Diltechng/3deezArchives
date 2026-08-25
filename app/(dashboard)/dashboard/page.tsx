"use client"

import { StatCard, StatCardSkeleton } from "@/features/dashboard/StatCard";
import { PageHeader } from "@/features/common/components/PageHeader"
import { api } from "@/features/common/lib/api";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CalendarClock, FolderOpen, UsersRound } from "lucide-react";
import { RecentEventsCard } from "@/features/dashboard/RecentEventsCard";

const HomePage = () => {
  const { isLoading: isLoadingStats, data: statsData } = useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");

      return response.data;
    }
  });

  const { user } = useCurrentUser();

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
                  href="/categories"
                  linkName="View all categories"
                />
              </>
            : <></>
        }
      </div>
      <div className="grid grid-cols-1 gap-4">
        <RecentEventsCard />
      </div>
    </section>
  )
}

export default HomePage;
