import Table from "@/features/common/components/Table";

const InvitationsTable = ({ children }: {
  children: React.ReactNode;
}) => (
  <Table headers={["Email", "Role", "Status", "Actions"]}>
    {children}
  </Table>
)

export default InvitationsTable;