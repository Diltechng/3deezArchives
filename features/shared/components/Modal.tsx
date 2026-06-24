import BackgroundOverlay from "./BackgroundOverlay";

interface ModalProps {
  children?: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

interface ModalHeaderProps {
  title?: string;
  subtitle?: string;
}

interface ModalBodyProps {
  children?: React.ReactNode;
}

interface ModalFooterProps {
  children?: React.ReactNode;
}

const Modal = ({ children, onSubmit }: ModalProps) => {
  return (
    <BackgroundOverlay>
      <form
        className="flex flex-col m-auto h-full w-full max-w-170 py-6 rounded-2xl shadow-lg border border-border bg-background"
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </BackgroundOverlay>
  )
}

Modal.Header = ({ title = "", subtitle = "" }: ModalHeaderProps) => {
  return (
    <header className="mb-4 px-6">
      <h1 className="font-bold text-[18px] tracking-[0.02rem]">{title}</h1>
      <p className="mt-0.5 font-sans text-[11px] text-text-3">{subtitle}</p>
    </header>
  );
}

Modal.Body = ({ children }: ModalBodyProps) => {
  return (
    <div className="px-6 overflow-x-auto">
      {children}
    </div>
  )
}

Modal.Footer = ({ children }: ModalFooterProps) => {
  return (
    <footer className="flex gap-2 px-6 pt-3 justify-end mt-auto">
      {children}
    </footer>
  )
}

export default Modal;