import BackgroundOverlay from "./BackgroundOverlay";

interface FormModalProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const FormModal = ({ title, subtitle, children }: FormModalProps) => {
  return (
    <BackgroundOverlay>
      <div
        className="flex flex-col m-auto h-full w-full max-w-170 py-6 rounded-2xl shadow-lg overflow-hidden border border-border bg-background"
      >
        <header className="mb-4 px-6">
          <h1 className="font-bold text-[18px] tracking-[0.02rem]">{title}</h1>
          <p className="mt-0.5 font-sans text-[11px] text-text-3">{subtitle}</p>
        </header>
        <div className="px-6 flex flex-col flex-1 overflow-x-auto">
          {children}
        </div>
      </div>
    </BackgroundOverlay>
  );
}

export const SubmitButton = ({ title, disabled=false }: {
  title?: string;
  disabled?: boolean;
}) => (
  <button
    type="submit"
    className="button-primary disabled:bg-neutral-800"
    disabled={disabled}
  >
    {title ?? "Submit"}
  </button>
);

export const CancelButton = ({ title, onClick }: {
  title?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    className="button-ghost"
    onClick={onClick}
  >
    {title ?? "Cancel"}
  </button>
)

export default FormModal;