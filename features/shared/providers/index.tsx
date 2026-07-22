"use client"

import { AuthProvider } from "@/features/auth/contexts/AuthContext"
import QueryProvider from "../contexts/QueryProvider";
import ModalProvider from "../contexts/ModalContext";
import SidebarProvider from "../contexts/SidebarContext";

export const Providers = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  )
}