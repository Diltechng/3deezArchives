import SettingsSidebar from "@/features/settings/components/SettingsSidebar";

const SettingsLayout = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-full">
      <SettingsSidebar />
      <div className="flex-1 px-4">
        {children}
      </div>
    </div>
  )
}

export default SettingsLayout;