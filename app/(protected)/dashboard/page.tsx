"use client"

import { StatCard } from "@/features/dashboard/components/StatCard";
import { PageHeader } from "@/features/common/components/PageHeader"
import { api } from "@/features/common/lib/api";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { useQuery } from "@tanstack/react-query";
import { Calendar, CalendarClock, FolderOpen, UsersRound } from "lucide-react";
import { RecentEventsCard } from "@/features/dashboard/components/RecentEventsCard";
import { Accent } from "@/features/common/types/accent.types";
import { QUERY_KEYS } from "@/lib/query-keys";

interface DashboardStat {
  label: string;
  icon: React.ComponentType<{ className: string; }>
  value: string;
  accent?: Accent;
  href: string;
  linkName?: string;
}

const HomePage = () => {
  const dashboardStatsQuery = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");

      return response.data;
    }
  });

  const { user } = useCurrentUser();

  const isLoading = dashboardStatsQuery.isLoading;
  const dashboardStats = dashboardStatsQuery.data?.data;

  const stats: DashboardStat[] = [
    {
      icon: Calendar,
      label: "Total Events",
      value: `${dashboardStats?.totalPosts ?? "-"}`,
      href: "/gallery",
      linkName: "View all events",
    },
    {
      icon: UsersRound,
      label: "Total Members",
      value: `${dashboardStats?.totalUsers ?? "-"}`,
      accent: "secondary",
      href: "/users",
      linkName: "View all members",
    },
    {
      icon: CalendarClock,
      label: "This Month",
      value: `${dashboardStats?.totalPostsThisMonth ?? "-"}`,
      accent: "info",
      href: "/gallery",
      linkName: "View events",
    },
    {
      icon: FolderOpen,
      label: "Categories",
      value: `${dashboardStats?.totalCategories ?? "-"}`,
      accent: "danger",
      href: "/categories",
      linkName: "View all categories",
    }
  ];

  return (
    <section>
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}.`}
        subtitle="A living record of the moments that made 3Deez Global Group."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-3 mb-3 md:mb-5">
        {
        (
            <>
              {stats.map(stat => (
                <StatCard isLoading={isLoading} key={stat.label} {...stat} />
              ))}
            </>
          )
        }
      </div>
      <div className="grid grid-cols-1 gap-4">
        <RecentEventsCard />
      </div>
    </section>
  )
}

export default HomePage;
