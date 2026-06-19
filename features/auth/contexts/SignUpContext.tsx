"use client"

import { useContext, createContext, useState, JSX, useEffect, useId, Dispatch, SetStateAction } from "react";

interface SignUpContextType {
    userId: string | null | undefined;
    email: string | null | undefined;
    saveSignUpData: ({ userId, email }: {
        userId: string;
        email: string;
    }) => void;
    deleteSignUpData: () => void;
}

const SignUpContext = createContext<SignUpContextType | null>(null);

export function useSignUpContext() {
  const context = useContext(SignUpContext);

  if (!context)
    throw new Error("useSignUpContext must be used within a SignUpProvider");

  return context;
}

export const SignUpProvider = ({ children }: Readonly<{
  children: React.ReactNode
}>) => {
  const [userId, setUserId] = useState<string | null>();
  const [email, setEmail] = useState<string | null>();

  useEffect(() => {
    const userId = localStorage.getItem("auth-user-id");
    const email = localStorage.getItem("auth-email");
    
    if (userId)
      setUserId(userId);
    else if (!userId)
      setUserId(null);
    
    if (email)
      setEmail(email);
    else if (!email)
      setEmail(null);
  }, []);

  useEffect(() => {
    if (userId)
      localStorage.setItem("auth-user-id", userId);

    if (email)
      localStorage.setItem("auth-email", email);
  }, [userId, email]);

  function saveSignUpData({ userId, email }: {
    userId: string;
    email: string;
  }) {
    setUserId(userId);
    setEmail(email);
  }

  function deleteSignUpData() {
    setEmail(undefined);
    setUserId(undefined);
    localStorage.removeItem("auth-email");
    localStorage.removeItem("auth-user-id");
  }

  const value = {
    userId,
    email,
    saveSignUpData,
    deleteSignUpData
  }

  return (
    <SignUpContext.Provider value={value}>
      {children}
    </SignUpContext.Provider>
  )
}