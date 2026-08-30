import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { cn } from "../lib/utils";

const DropdownMenu = ({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => (
  <DropdownMenuPrimitive.Root {...props} />
);

const DropdownMenuTrigger = ({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => (
  <DropdownMenuPrimitive.Trigger className={cn("focus:outline-none", className)} {...props} />
);

const DropdownMenuContent = ({ align="end", className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      align={align}
      className={cn(
        "grid gap-1 p-2 z-10 font-sans rounded-md shadow-md border border-border bg-surface-primary",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

const DropdownMenuItem = ({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item>) => (
  <DropdownMenuPrimitive.Item className={cn("focus:outline-none", className)} {...props} />
);

const DropdownMenuArrow = ({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Arrow>) => (
  <DropdownMenuPrimitive.Arrow className={cn("fill-surface-primary", className)} {...props} />
);

const DropdownMenuSeparator = ({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => (
  <DropdownMenuPrimitive.Separator className={cn("h-px bg-border", className)} {...props} />
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuArrow,
  DropdownMenuSeparator,
}