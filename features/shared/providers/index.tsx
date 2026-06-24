"use client"

import { AuthProvider } from "@/features/auth/contexts/AuthContext"
import QueryProvider from "../contexts/QueryProvider";
import ModalProvider from "../contexts/ModalContext";

export const Providers = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          {children}
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  )
}