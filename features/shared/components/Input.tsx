import React from "react";
import { cn } from "../lib/utils";

export const Field = ({ className, children }: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
      {children}
  </div>
);

export const Label = ({ htmlFor, children }: {
  htmlFor?: string;
  children?: string;
}) => (
    <label htmlFor={htmlFor} className="text-[10px] tracking-[0.08rem] text-text-3">
      {children}
    </label>
);