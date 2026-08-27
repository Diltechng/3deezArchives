import { cn } from "../lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingStateProps {
  isFullScreen?: boolean;
};

const LoadingState = ({ isFullScreen }: LoadingStateProps) => (
  <div
    className={cn(
      "flex justify-center items-center h-full w-full",
      { "fixed inset-0": isFullScreen }
    )}
  >
    <LoadingSpinner />
  </div>
);

export { LoadingState };