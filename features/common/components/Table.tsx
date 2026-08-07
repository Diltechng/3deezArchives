const Table = ({ headers, children }: {
  headers: string[];
  children: React.ReactNode;
}) => {
  return (
    <table className="w-full text-[12px]">
      <thead>
        <tr>
          {headers.map(title =>
            <th
              key={title}
              className="font-mono text-[9px] tracking-[0.08rem] py-2 px-3 text-left border-b border-border text-text-3 bg-surface-2"
            >
              {title}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

export default Table;