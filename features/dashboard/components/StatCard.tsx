import { ArrowRight } from "lucide-react";
import { cn } from "../../common/lib/utils";
import { Accent } from "../../common/types/accent.types";
import Link from "next/link";
import { Skeleton } from "../../common/ui/Skeleton";
import { Card } from "../../common/ui/Card";

interface StatCardProps {
  label: string;
  icon: React.ComponentType<{ className: string; }>
  value: string;
  accent?: Accent;
  href: string;
  linkName?: string;
  isLoading?: boolean
}

export const StatCard = ({
  label,
  value,
  href,
  icon: Icon,
  linkName="View all",
  accent="primary",
  isLoading = false
}: StatCardProps) => (
  <Card className="flex flex-col justify-between gap-2 p-3.5">
    <div className="flex gap-4">
      {isLoading
      ? <Skeleton className="size-8 sm:size-10" />
      : (
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 shrink-0 grid place-items-center rounded-lg",
            { "bg-accent-primary/20 text-accent-primary": accent === "primary" },
            { "bg-accent-secondary/20 text-accent-secondary": accent === "secondary" },
            { "bg-accent-info/20 text-accent-info": accent === "info" },
            { "bg-accent-danger/20 text-accent-danger": accent === "danger" },
            { "bg-accent-neutral/20 text-accent-neutral": accent === "neutral" },
          )}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )
      }
      <div>
        {isLoading
          ? <Skeleton className="h-4 w-20 mb-2" />
          : <div className="text-xs font-medium mb-1 text-foreground-secondary">{label}</div>
        }
        {isLoading
          ? <Skeleton className="h-8 w-12" />
          : <div className="font-extrabold text-3xl">{value}</div>
        }
      </div>
    </div>
    {isLoading
      ? <Skeleton className="h-4 w-30 lg:ml-14" />
      : (
        <Link href={href} className={cn(
          "text-xs font-medium lg:ml-14",
            { "text-accent-primary": accent === "primary" },
            { "text-accent-secondary": accent === "secondary" },
            { "text-accent-info": accent === "info" },
            { "text-accent-danger": accent === "danger" },
            { "text-foreground-primary": accent === "neutral" },
        )}>
          {linkName} <ArrowRight className="inline w-3.25 h-3.25" />
        </Link>
      )
    }
  </Card>
);