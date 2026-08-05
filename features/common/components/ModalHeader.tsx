interface ModalHeaderProps {
  title: string;
  subtitle?: string;
}

export const ModalHeader = ({ title, subtitle }: ModalHeaderProps) => {
  return (
    <header className="py-4.5 px-4 sm:px-5.5 border-b border-border">
      <h1 className="font-bold text-[18px] tracking-[0.02rem]">{title}</h1>
      <p className="mt-0.5 font-sans text-[11px] text-text-3">{subtitle}</p>
    </header>
  )
}