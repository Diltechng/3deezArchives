const TableData = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <td className="py-2.5 px-3">
      {children}
    </td>
  );
}

export default TableData;