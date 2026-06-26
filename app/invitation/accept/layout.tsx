import InvitationProvider from "@/features/invitation/contexts/InvitationContext";

const InvitationLayout = ({ children }: {
  children: React.ReactNode;
}) => (
  <InvitationProvider>
    <main className="h-screen overflow-auto">
      {children}
    </main>
  </InvitationProvider>
)

export default InvitationLayout;