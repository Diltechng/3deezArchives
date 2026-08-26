import SettingsNav from "@/features/settings/components/SettingsNav";

const SettingsLayout = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col sm:flex-row h-full min-w-0">
      <SettingsNav />
      <div className="flex-1 px-4">
        {children}
      </div>
    </div>
  )
}

export default SettingsLayout;