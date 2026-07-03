"use client"

import ContentHeader from "@/features/shared/components/ContentHeader"
import { api } from "@/features/shared/lib/api";
import { cn } from "@/features/shared/lib/utils";
import { getTimeAgo } from "@/shared/utils/time";
import { useQuery } from "@tanstack/react-query";
import { ClassValue } from "clsx";
import Link from "next/link";

const StatCardSkeleton = () => (
  <div className="p-3.5 rounded-lg animate-shimmer bg-shimmer border border-border">
    <div className="h-4 w-20 mb-1.5 text-[10px] tracking-[0.06em] rounded-lg uppercase animate-shimmer border border-border-2/20 bg-shimmer" />
    <div className="h-10 w-30 font-bold text-[22px] rounded-[3px] animate-shimmer border border-border-2/20 bg-shimmer" />
  </div>
);

const StatCard = ({ label, value, valueAccent }: {
  label: string;
  value: string;
  valueAccent?: boolean
}) => (
  <div className="p-3.5 rounded-lg bg-surface border border-border">
    <div className="mb-1.5 text-[10px] tracking-[0.06em] uppercase text-text-3">{label}</div>
    <div className={cn("font-bold text-[22px]", { "text-accent" :valueAccent })}>{value}</div>
  </div>
);

const PostCardSkeleton = () => (
  <div className="py-2.5 flex items-start gap-2.5 text-[11px] animate-shimmer border-b border-border bg-shimmer">
    <div className="h-1.5 w-1.5 mt-0.75 rounded-full animate-shimmer border border-border-2/30 bg-shimmer" />
    <div className="flex-1 font-sans text-text-2">
      <div className="h-3 w-20 mb-2 rounded-[3px] animate-shimmer border border-border-2/30 bg-shimmer" />
      <div className="h-3 w-1/3 rounded-[3px] animate-shimmer border border-border-2/30 bg-shimmer" />
    </div>
    <div className="mt-0.5 h-3 w-8 rounded-[3px] animate-shimmer border border-border-2/30 bg-shimmer" />
  </div>
);

const PostCard = ({ post, className }: {
  post: any;
  className?: ClassValue;
}) => (
  <Link href={`/gallery/post/${post.id}`} className={cn(
    "py-2.5 flex items-start gap-2.5 text-[11px] border-b border-border",
    className
  )}>
    <div className="h-1.5 w-1.5 mt-0.75 rounded-full bg-accent-3" />
    <div className="flex-1 font-sans text-text-2">
      <div className="text-text">{post.title}</div>
      {`Uploaded by ${post.uploadedByUser.name} · `}
      <span className="text-accent-3">{post.category.name}</span>
    </div>
    <div className="mt-0.5 text-[9px] text-text-3">{getTimeAgo(post.createdAt)}</div>
  </Link>
);

const HomePage = () => {
  const { isLoading: isLoadingStats, data: statsData } = useQuery({
    queryKey: ["dashboard_stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");

      console.log(response.data);
      return response.data;
    }
  });

  return (
    <section>
      <ContentHeader title="Dashboard" subtitle="Welcome back — here's the archive status" />
      <div className="grid grid-cols-4 gap-3 mb-5">
        {isLoadingStats
          ? <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
          : statsData?.data
            ? <>
              <StatCard label="Total Posts" value={`${statsData.data.totalPosts ?? "-"}`} valueAccent />
              <StatCard label="Members" value={`${statsData.data.totalUsers ?? "-"}`} />
              <StatCard label="This month" value={`${statsData.data.totalPostsThisMonth ?? "-"}`} valueAccent />
              <StatCard label="Categories" value={`${statsData.data.totalCategories ?? "-"}`} />
            </>
            : <></>
        }
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="py-3 px-3.5 flex justify-between items-center border-b border-border bg-surface-2">
            <div className="text-[10px] tracking-[0.06em] uppercase text-text-2">
              Recent Posts
            </div>
            <Link href="/gallery" className="text-[9px] text-accent">
              view all →
            </Link>
          </div>
          <div className="py-2 px-3 flex flex-col">
            {isLoadingStats
              ? <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
              : statsData?.data?.recentPosts?.length && statsData.data.recentPosts.map((post: any, i: number) => (
                <PostCard key={post.id} post={post} className={{"border-none": (i === (statsData.data.recentPosts.length - 1))}} />
              ))
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage;
