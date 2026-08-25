import { forwardRef } from "react";
import { cn } from "../lib/utils";
import { Slot } from "radix-ui";

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  children?: React.ReactNode;
  Icon?: React.ComponentType<{ className: string }>;
  active?: boolean;
  asChild?: boolean;
  variant?: "contained" | "text" | "outlined";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant="contained",
    active=false,
    asChild=false,
    Icon,
    children,
    ...props
  }, ref) => {
    const Comp = asChild? Slot.Root: "button";

    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(
          "flex items-center gap-2 py-2 px-4 text-[13px] text-left rounded-lg duration-200",
          
          variant === "contained" && (
            "font-semibold bg-accent-primary text-background"
          ),

          variant === "outlined" && (
            "border border-border hover:bg-surface"
          ),

          variant === "text" && cn(active
            ? "bg-accent-primary/10 text-accent-primary"
            : "text-foreground-secondary hover:text-text hover:bg-surface"
          ),
          className,
        )}
      >
        {Icon && <Icon className="h-5 w-5" />}
        <Slot.Slottable>{children}</Slot.Slottable>
      </Comp>
    )
  }
);

export default Button;