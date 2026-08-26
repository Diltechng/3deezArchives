"use client"
import { SignUpProvider } from "@/features/auth/contexts/SignUpContext"
import "./auth.css"
import { GuestPage } from "@/features/auth/components/GuestPage"

const AuthLayout = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <GuestPage>
      <SignUpProvider>
        {children}
      </SignUpProvider>
    </GuestPage>
  )
}

export default AuthLayout;