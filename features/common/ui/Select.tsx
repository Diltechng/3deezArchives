import { ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui"
import React from "react";
import { cn } from "../lib/utils";
import { Button } from "./Button";

const Select = ({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) => (
  <SelectPrimitive.Root {...props} />
);

const SelectValue = ({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) => (
  <SelectPrimitive.Value {...props} />
);

const SelectTrigger = ({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) => (
  <SelectPrimitive.Trigger
    className={cn(
      "flex justify-between items-center px-3 py-2.25 text-sm rounded-lg duration-200 focus:outline-none",
      "[&>span:first-child]:truncate border border-border bg-surface focus:border-accent-primary",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({
  className,
  position="popper",
  side="bottom",
  sideOffset=5,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      position={position}
      side={side}
      sideOffset={sideOffset}
      className={cn(
        "z-900 border rounded-lg border-border bg-surface w-(--radix-select-trigger-width)",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1.25">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) => (
  <Button asChild variant="text">
    <SelectPrimitive.Item
      className={cn("rounded-md focus:outline-none text-text hover:bg-surface-secondary", className)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  </Button>
);

export {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};