import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cn } from "../lib/utils";

type InputProps = ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type="text", className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "px-3 py-2.25 text-sm rounded-lg duration-200 border border-border-primary bg-surface-primary focus:border-accent-primary",
          className,
        )}
        {...props}
      />
    )
  }
);