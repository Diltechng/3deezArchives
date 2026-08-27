import { cn } from "../lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  radius?: number;
  width?: number;
}

const LoadingSpinner = ({ className, radius=10, width=3 }: LoadingSpinnerProps) => (
  <div
    className={cn(
      "rounded-full border border-border-2 border-t-accent-primary animate-spin",
      className
    )}
    style={{
      height: `${radius*4}px`,
      width: `${radius*4}px`,
      borderWidth: `${width}px`
    }}
  />
);

export { LoadingSpinner };