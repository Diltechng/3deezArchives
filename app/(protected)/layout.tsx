"use client"
import Sidebar from "@/features/shared/components/Sidebar";
import Topbar from "@/features/shared/components/Topbar";
import { AuthProvider } from "@/features/auth/contexts/AuthContext"

const ProtectedLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default ProtectedLayout;