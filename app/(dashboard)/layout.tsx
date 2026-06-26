"use client"
import ModalRenderer from "@/features/shared/components/ModalRenderer";
import Sidebar from "@/features/shared/components/Sidebar";
import Topbar from "@/features/shared/components/Topbar";

const DashboardLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col h-screen">
      <ModalRenderer />
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="p-6 flex flex-col flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;