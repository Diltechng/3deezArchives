interface ModalBody {
  children: React.ReactNode;
}

export const ModalBody = ({ children }: ModalBody) => {
  return (
    <div className="flex-1 px-4 sm:px-6 py-2 overflow-y-auto">
      {children}
    </div>
  )
}