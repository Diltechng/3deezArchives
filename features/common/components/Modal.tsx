import { Backdrop } from "../ui/Backdrop";

interface ModalProps {
  children: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  return (
    // Overlay
    <div className="fixed grid place-items-center inset-0 z-90">
      <Backdrop className="absolute inset-0" />
      
      {/* Modal Surface */}
      <div
        className="
          relative flex flex-col h-full w-full max-w-170 sm:h-fit sm:max-h-9/10 py-6
          sm:rounded-2xl shadow-lg overflow-hidden sm:border border-border bg-background
        "
      >
        {children}
      </div>
    </div>
  )
}