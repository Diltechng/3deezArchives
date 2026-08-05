import { cn } from "../lib/utils";
import { Backdrop } from "../ui/Backdrop";

interface ModalProps {
  className?: string;
  children: React.ReactNode;
}

export const Modal = ({ className, children }: ModalProps) => {
  return (
    // Overlay
    <div className="fixed grid place-items-center inset-0 z-90">
      <Backdrop className="absolute inset-0" />
      
      {/* Modal Surface */}
      <div
        className={cn(
          "relative flex flex-col h-full w-full max-w-170 sm:h-fit sm:max-h-9/10",
          "sm:rounded-2xl shadow-lg overflow-hidden sm:border border-border bg-background",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}