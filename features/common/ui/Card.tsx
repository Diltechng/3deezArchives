import { forwardRef } from "react";
import { cn } from "../lib/utils";

type CardProps = React.ComponentPropsWithoutRef<"div">;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg bg-surface-primary border border-border",
        className
      )}
      {...props}
    />
  )
);

export { Card };