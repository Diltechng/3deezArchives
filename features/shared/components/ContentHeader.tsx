const ContentHeader = ({ title, subtitle, children }: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) => (
  <header className="flex justify-between items-center mb-5">
    <div>
      <h1 className="font-bold text-[18px]">{title}</h1>
      <p className="font-sans text-sm text-text-3">{subtitle}</p>
    </div>
    {children}
  </header>
);

export default ContentHeader;