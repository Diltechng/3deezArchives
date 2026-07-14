import TableData from "@/features/shared/components/TableData";
import { cn } from "@/features/shared/lib/utils";

export const InvitationsTableRowSkeleton = () => (
  <tr>
    <TableData>
      <div className="h-4 w-full font-sans rounded-[3px] border border-border-2/20 bg-shimmer animate-shimmer" />
    </TableData>
    <TableData>
      <div className="h-5 w-full max-w-20 rounded-[3px] tracking-[0.08rem] text-[9px] border border-border-2/20 bg-shimmer animate-shimmer" />
    </TableData>
    <TableData>
      <div className="h-4 w-full max-w-18 flex items-center gap-1.25 text-[10px] rounded-[3px] border border-border-2/20 bg-shimmer animate-shimmer" />
    </TableData>
    <TableData>
      <div className="flex gap-1.5">
        <div className="flex justify-center items-center h-6.5 w-6.5 rounded-[3px] border border-border-2/20 bg-shimmer animate-shimmer" />
        <button className="flex justify-center items-center h-6.5 w-6.5 rounded-[3px] border border-border-2/20 bg-shimmer animate-shimmer">

        </button>
      </div>
    </TableData>
  </tr>
);

const InvitationsTableRow = ({ invitation }: {
  invitation: any;
}) => {
  const isAdmin = invitation.role === "admin";
  const isActive = invitation.status === "active";

  return(
    <tr>
      <TableData>
        <span className="font-[10px] font-sans">
          {invitation.email}
        </span>
      </TableData>
      <TableData>
        <span
          className={cn(
            "py-0.75 px-2 rounded-[3px] tracking-[0.08rem] text-[9px] border",
            isAdmin? "text-accent border-accent bg-accent/20"
            : "text-accent-3 border-accent-3 bg-accent-3/20"
          )}
        >
          {invitation.role?.toUpperCase() ?? "-"}
        </span>
      </TableData>
      <TableData>
        <div className={cn(
          "flex items-center gap-1.25 text-[10px] text-accent",
          {"text-accent-3": isActive}
        )}>
          <div className="h-1.5 w-1.5 rounded-full bg-current" />
          <span>{invitation.status?.replace(/^./, (c: string) => c.toUpperCase()) ?? "-"}</span>
        </div>
      </TableData>
      <TableData>
        <div className="flex gap-1.5">
          <button className="flex justify-center items-center h-6.5 w-6.5 rounded-lg border text-text-2 border-border-2 hover:border-accent">

          </button>
          <button className="flex justify-center items-center h-6.5 w-6.5 rounded-lg border text-text-2 border-border-2 hover:border-accent">

          </button>
        </div>
      </TableData>
    </tr>
  )
}

export default InvitationsTableRow;