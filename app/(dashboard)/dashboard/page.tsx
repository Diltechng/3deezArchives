"use client"

import ContentHeader from "@/features/shared/components/ContentHeader"
import { api } from "@/features/shared/lib/api";
import { accentFadedCn, accentFromName, accentSolidCn, accentTextCn, cn } from "@/features/shared/lib/utils";
import { Accent } from "@/features/shared/types/accent.types";
import Button from "@/features/shared/ui/Button";
import { NoEvent } from "@/features/shared/ui/icons/NoEvent";
import { useQuery } from "@tanstack/react-query";
import { ClassValue } from "clsx";
import dayjs from "dayjs";
import { ArrowRight, Calendar, CalendarClock, EllipsisVertical, FolderOpen, Image, Info, Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";
import React from "react";

const StatCardSkeleton = () => (
  <div className="p-3.5 rounded-lg animate-shimmer bg-shimmer border border-border">
    <div className="h-4 w-20 mb-1.5 text-[10px] tracking-[0.06em] rounded-lg uppercase animate-shimmer border border-border-2/20 bg-shimmer" />
    <div className="h-10 w-30 font-bold text-[22px] rounded-[3px] animate-shimmer border border-border-2/20 bg-shimmer" />
  </div>
);

const StatCard = ({ label, value, href, linkName="View all", accent="primary", Icon }: {
  label: string;
  Icon: React.ComponentType<{ className: string; }>
  value: string;
  accent?: Accent;
  href: string;
  linkName?: string;
}) => (
  <div className="flex flex-col justify-between gap-2 p-3.5 rounded-lg bg-surface border border-border">
    <div className="flex gap-4">
      <div className={cn(
        "w-8 h-8 sm:w-10 sm:h-10 shrink-0 grid place-items-center rounded-lg",
        accentSolidCn(accent)
      )}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div>
        <div className="text-xs text-foreground-secondary">{label}</div>
        <div className="font-bold text-2xl">{value}</div>
      </div>
    </div>
    <Link href={href} className={cn("text-[10px] lg:ml-14 font-sans", accentTextCn(accent))}>
      {linkName} <ArrowRight className="inline w-2.5 h-2.5" />
    </Link>
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
  <div className={cn(
    "py-2.5 flex items-center justify-between text-sm border-b border-border",
    className
  )}>
    <Link href={`/gallery/post/${post.id}`} className="flex gap-2 items-center">
      <div className="relative shrink-0 w-20 h-15 overflow-hidden rounded-lg">
        <CldImage
          src={post.coverMedia.secureUrl}
          alt={post.title}
          sizes="20vw"
          className="object-cover"
          fill
        />
      </div>
      <div className="grid gap-1 font-sans text-text-2">
        <div className="flex flex-col md:flex-row gap-1 items-start md:items-center text-text truncate">
          {post.title}
          <div
            className={cn(
              accentTextCn(accentFromName(post.category.name)),
              accentFadedCn(accentFromName(post.category.name)),
              "inline-block px-1 py-0.5 rounded-sm text-[10px] truncate"
            )}
          >
            {post.category.name}
          </div>
        </div>
        <span className="text-xs">
          {`${dayjs(post.createdAt).format("MMMM DD, YYYY")} · ${post.uploadedByUser.name}`}
        </span>
        <div className="text-xs">
          <div className="flex gap-1 items-center">
            <Image className="w-3.5 h-3.5" />
            {post.media.length}
          </div>
        </div>
      </div>
    </Link>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 text-foreground-secondary">
          <EllipsisVertical className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="grid gap-1 p-2 font-sans rounded-md shadow-md border border-border bg-surface">
          <DropdownMenu.Item asChild>
            <Button variant="text" className="text-xs hover:bg-surface-2">
              <Info className="w-4 h-4" />
              View Details
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Button variant="text" className="text-xs hover:bg-surface-2">
              <Pencil className="w-4 h-4" />
              Edit Event
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-border" />
          <DropdownMenu.Item asChild>
            <Button variant="text" className="text-xs text-accent-danger hover:text-accent-danger hover:bg-accent-danger/10">
              <Trash2 className="w-4 h-4" />
              Delete Event
            </Button>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow
            className="fill-border"
          />
          <DropdownMenu.Arrow
            className="relative -top-0.5 fill-surface"
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </div>
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
            <div className="text-sm tracking-tighter">
              Recent Events
            </div>
            <Link href="/gallery" className="text-[9px] text-accent-secondary">
              View all events <ArrowRight className="inline w-2.5 h-2.5" />
            </Link>
          </div>
          <div className="px-4 flex flex-col">
            {isLoadingStats
              ? <>
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
              : statsData?.data?.recentPosts?.length
                ? statsData.data.recentPosts.map((post: any, i: number) => (
                  <PostCard key={post.id} post={post} className={{"border-none": (i === (statsData.data.recentPosts.length - 1))}} />
                ))
              : (
                <div className="flex flex-col items-center text-center font-sans">
                  <NoEvent className="w-full max-w-100 aspect-video" />
                  <p className="mb-2 text-lg font-medium">No Events Yet</p>
                  <p className="max-w-80 text-xs mb-4 text-foreground-secondary">Get started by adding your first event to build your organization's archive.</p>
                  <Button className="w-fit gap-1 font-medium" Icon={Plus}>
                    <Link href="/gallery">
                      Add Your First Event
                    </Link>
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
