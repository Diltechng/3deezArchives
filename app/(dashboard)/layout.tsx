"use client"
import { ModalRenderer } from "@/features/common/components/ModalRenderer";
import { Sidebar } from "@/features/common/components/Sidebar";
import Topbar from "@/features/common/components/Topbar";

const DashboardLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex h-screen">
      <ModalRenderer />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Topbar />
        <main className="p-4 md:p-6 flex flex-col flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;