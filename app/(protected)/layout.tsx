"use client"
import { AuthProvider } from "@/contexts/AuthContext"

const ProtectedLayout = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

export default ProtectedLayout;