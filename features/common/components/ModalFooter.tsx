interface ModalFooterProps {
  children: React.ReactNode;
}

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="flex gap-2 px-4 sm:px-5.5 py-4 justify-end mt-auto border-t border-border">
      {children}
    </div>
  )
}