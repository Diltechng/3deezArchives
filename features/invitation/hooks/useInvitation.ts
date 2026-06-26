import { useContext } from "react"
import { InvitationContext } from "../contexts/InvitationContext"

export function useInvitation() {
  const context = useContext(InvitationContext);

  if (!context)
    throw new Error("useInvitation must be used within an InvitationProvider");

  return context; 
}