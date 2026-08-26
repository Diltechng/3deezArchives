import { ArrowRight } from "lucide-react";
import { accentFadedCn, accentSolidCn, accentTextCn, cn } from "../common/lib/utils";
import { Accent } from "../common/types/accent.types";
import Link from "next/link";

export const StatCardSkeleton = () => (
  <div className="p-3.5 rounded-lg animate-shimmer bg-shimmer border border-border">
    <div className="h-4 w-20 mb-1.5 text-[10px] tracking-[0.06em] rounded-lg uppercase animate-shimmer border border-border-2/20 bg-shimmer" />
    <div className="h-10 w-30 font-bold text-[22px] rounded-[3px] animate-shimmer border border-border-2/20 bg-shimmer" />
  </div>
);

export const StatCard = ({ label, value, href, linkName="View all", accent="primary", Icon }: {
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
        { "bg-accent-primary text-surface": accent === "primary" },
        { "bg-accent-secondary": accent === "secondary" },
        { "bg-accent-info": accent === "info" },
        { "bg-accent-danger": accent === "danger" },
        { "bg-accent-neutral": accent === "neutral" },
      )}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div>
        <div className="text-xs font-medium mb-1 text-foreground-secondary">{label}</div>
        <div className="font-extrabold text-3xl">{value}</div>
      </div>
    </div>
    <Link href={href} className={cn(
      "text-xs font-medium lg:ml-14",
        { "text-accent-primary": accent === "primary" },
        { "text-accent-secondary": accent === "secondary" },
        { "text-accent-info": accent === "info" },
        { "text-accent-danger": accent === "danger" },
        { "text-text":
           accent === "neutral" },
    )}>
      {linkName} <ArrowRight className="inline w-3.25 h-3.25" />
    </Link>
  </div>
);