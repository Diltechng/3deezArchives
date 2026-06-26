"use client"

import { createContext, useState } from "react"

interface ValueTypes {
  invitationData: InvitationData | undefined;
  handleSetInvitationData: (data: InvitationData) => void;
}

interface InvitationData {
  token: string;
  email: string;
  role: string;
}

export const InvitationContext = createContext<ValueTypes | null>(null);

const InvitationProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [invitationData, setInvitationData] = useState<InvitationData>();

  function handleSetInvitationData(data: InvitationData) {
    setInvitationData(data)
  }

  const value: ValueTypes = {
    invitationData,
    handleSetInvitationData
  }

  return <InvitationContext.Provider value={value}>{children}</InvitationContext.Provider>
}

export default InvitationProvider;