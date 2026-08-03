interface ModalHeaderProps {
  title: string;
  subtitle?: string;
}

export const ModalHeader = ({ title, subtitle }: ModalHeaderProps) => {
  return (
    <header className="mb-4 px-6">
      <h1 className="font-bold text-[18px] tracking-[0.02rem]">{title}</h1>
      <p className="mt-0.5 font-sans text-[11px] text-text-3">{subtitle}</p>
    </header>
  )
}