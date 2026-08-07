"use client"

import { createContext, useState } from "react"

interface ValueTypes {
  desktopOpen: boolean;
  mobileOpen: boolean;
  toggleDesktop: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

export const SidebarContext = createContext<ValueTypes | null>(null);

const SidebarProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const toggleDesktop = () => {
    setDesktopOpen(prev => !prev);
    setMobileOpen(false);
  }

  const toggleMobile = () => {
    setMobileOpen(prev => !prev);
    setDesktopOpen(true);
  }

  const closeMobile = () => {
    setMobileOpen(false);
  }

  const value: ValueTypes = {
    desktopOpen,
    mobileOpen,
    toggleDesktop,
    toggleMobile,
    closeMobile,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;