"use client"
import { SignUpProvider } from "@/contexts/SignUpContext"
import "./auth.css"

const AuthLayout = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SignUpProvider>
      {children}
    </SignUpProvider>
  )
}

export default AuthLayout;