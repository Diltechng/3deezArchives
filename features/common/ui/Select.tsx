import { ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui"
import React from "react";
import { cn } from "../lib/utils";
import Button from "./Button";

interface SelectProps {
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export const Select = ({ label, value, onValueChange, children }: SelectProps) => {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className="
          flex justify-between items-center px-3 py-2.25 text-sm rounded-lg duration-200
          [&>span:first-child]:truncate border border-border bg-surface focus:border-accent-primary
        "
      >
        <SelectPrimitive.Value placeholder={label} />
        <SelectPrimitive.SelectIcon>
          <ChevronDown className="w-4 h-4" />
        </SelectPrimitive.SelectIcon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          side="bottom"
          sideOffset={5}
          className="z-900 border rounded-lg border-border bg-surface w-(--radix-select-trigger-width)"
        >
          <SelectPrimitive.Viewport className="p-1.25">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const SelectItem = ({ value, className, children }: SelectItemProps) => {
  return (
    <Button
      asChild
      variant="text"
      className={cn("rounded-md text-text hover:bg-surface-2", className)}
    >
      <SelectPrimitive.Item value={value}>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    </Button>
  )
}