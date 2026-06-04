"use client"
import Sidebar from "@/features/shared/components/Sidebar";
import Topbar from "@/features/shared/components/Topbar";
import { AuthProvider } from "@/features/auth/contexts/AuthContext"
import { useState } from "react";

const ProtectedLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="p-6 flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default ProtectedLayout;