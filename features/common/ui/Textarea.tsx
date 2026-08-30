import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../lib/utils"

type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "px-3 py-2.25 text-sm rounded-lg duration-200 border",
          "border-border bg-surface-primary focus:border-accent-primary",
          className,
        )}
        {...props}
      />
    )
  }
);