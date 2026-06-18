const BackgroundOverlay = ({ children }: {
  children: React.ReactNode;
}) => (
  <div className="fixed flex flex-col p-8 top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-sm bg-black/20">
    {children}
  </div>
);

export default BackgroundOverlay;