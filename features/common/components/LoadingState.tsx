import { cn } from "../lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingStateProps {
  isFullScreen?: boolean;
  children?: React.ReactNode;
};

const LoadingState = ({ isFullScreen, children }: LoadingStateProps) => (
  <div
    className={cn(
      "flex justify-center items-center h-full w-full",
      { "fixed inset-0": isFullScreen }
    )}
  >
    {children ?? <LoadingSpinner />}
  </div>
);

export { LoadingState };