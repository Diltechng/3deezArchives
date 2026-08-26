import { GuestPage } from "@/features/auth/components/GuestPage";
import InvitationProvider from "@/features/invitation/contexts/InvitationContext";

const InvitationLayout = ({ children }: {
  children: React.ReactNode;
}) => (
  <GuestPage>
    <InvitationProvider>
      <main className="h-screen overflow-auto">
        {children}
      </main>
    </InvitationProvider>
  </GuestPage>
)

export default InvitationLayout;