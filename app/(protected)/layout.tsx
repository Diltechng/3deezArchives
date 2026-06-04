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
        <div className="flex h-full">
          <Sidebar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default ProtectedLayout;