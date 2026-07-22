import { ClassValue } from "clsx";
import { cn } from "../lib/utils";

const BackgroundOverlay = ({ children, className, onClick }: {
  children: React.ReactNode;
  className?: ClassValue;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "fixed flex flex-col p-8 top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/20",
      className
    )}
  >
    {children}
  </div>
);

export default BackgroundOverlay;