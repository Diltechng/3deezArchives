import { cn } from "../lib/utils";
import { Backdrop } from "../ui/Backdrop";

interface ModalProps {
  className?: string;
  size?: "small" | "large";
  children: React.ReactNode;
}

export const Modal = ({ className, children, size="large" }: ModalProps) => {
  return (
    // Overlay
    <div className="fixed flex justify-center items-center inset-0 z-90">
      <Backdrop className="absolute inset-0" />
      
      {/* Modal Surface */}
      <div
        role="dialog"
        className={cn(
          "relative sm:mx-6 flex flex-col w-full sm:h-fit sm:max-h-9/10",
          "sm:rounded-2xl shadow-lg overflow-hidden sm:border border-border-primary bg-background",
          { "h-full max-w-170": size==="large" },
          { "border rounded-2xl mx-6 max-w-130": size==="small" },
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}