import { cn } from "../lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn(
      "rounded-md animate-shimmer bg-shimmer",
      className
    )}
    {...props}
  />
);

export { Skeleton };