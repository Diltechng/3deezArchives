const PageHeader = ({ title, subtitle, children }: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) => (
  <header className="flex justify-between items-center mb-5">
    <div>
      <h1 className="font-bold text-4xl mb-2">{title}</h1>
      <p className="text-[13px] text-text-3">{subtitle}</p>
    </div>
    {children}
  </header>
);

export { PageHeader };