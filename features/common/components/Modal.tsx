interface ModalProps {
  children: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  return (
    <div
      className="
        flex flex-col m-auto h-fit w-full max-w-170 py-6 rounded-2xl shadow-lg
        overflow-hidden border border-border bg-background
      "
    >
      {children}
    </div>
  )
}