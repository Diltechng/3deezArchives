import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { Slot } from "radix-ui";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  active?: boolean;
  asChild?: boolean;
  variant?: "contained" | "text" | "outlined";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    type="button",
    variant="contained",
    active=false,
    asChild=false,
    ...props
  }, ref) => {
    const Comp = asChild? Slot.Slot: "button";

    return (
      <Comp
        ref={ref}
        type={asChild? undefined: type}
        className={cn(
          "flex items-center gap-2 py-2 px-4 text-sm text-left rounded-lg duration-200",
          
          variant === "contained" && (
            "font-semibold bg-accent-primary text-background"
          ),

          variant === "outlined" && (
            "border border-border hover:bg-surface-primary"
          ),

          variant === "text" && cn(active
            ? "bg-accent-primary/10 text-accent-primary"
            : "text-foreground-secondary hover:text-text hover:bg-surface-primary"
          ),
          className,
        )}
        {...props}
      />
    )
  }
);

export { Button };