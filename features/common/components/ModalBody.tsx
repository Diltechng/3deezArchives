import { cn } from "../lib/utils";

interface ModalBody {
  className?: string;
  children: React.ReactNode;
}

export const ModalBody = ({ children, className }: ModalBody) => {
  return (
    <div className={cn("flex-1 px-4 sm:px-6 py-2 overflow-y-auto", className)}>
      {children}
    </div>
  )
}