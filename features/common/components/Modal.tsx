interface ModalProps {
  children: React.ReactNode;
}

export const Modal = ({ children }: ModalProps) => {
  return (
    <div
      className="
        flex fixed top-0 left-0 right-0 sm:relative h-screen flex-col m-auto sm:h-fit w-full max-w-170 py-6 sm:rounded-2xl shadow-lg
        overflow-hidden sm:border border-border bg-background
      "
    >
      {children}
    </div>
  )
}