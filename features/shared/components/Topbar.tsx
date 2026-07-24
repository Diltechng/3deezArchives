import { TextAlignStart } from "lucide-react";
import { usePathname } from "next/navigation";
import useSidebar from "../hooks/useSidebar";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { cn, getInitials } from "../lib/utils";

const Topbar = () => {
  const { toggleDesktop, toggleMobile } = useSidebar();
  const pathName = usePathname();
  const routeMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/activity-logs": "Activity Logs",
    "/gallery": "Gallery",
    "/users": "Users",
    "/users/invitations": "User Invitations",
    "/settings": "Settings",
    "/settings/account": "Account",
  }
  
  const pageName = routeMap[pathName];
  const { user } = useCurrentUser();
  const isAdmin = user?.role === "admin";

  return (
    <header className="flex px-3.5 py-1.5 justify-between border-b border-border bg-surface-2">
      <div className="flex items-center gap-2 font-bold text-[14px] tracking-[0.04rem] text-accent">
        <button
          className="md:hidden p-1.5 rounded-md text-text-2 hover:text-text hover:bg-surface-3"
          onClick={toggleMobile}
        >
          <TextAlignStart className="h-5.5 w-5.5" />
        </button>
        <button
          className="hidden md:block p-1.5 rounded-md text-text-2 hover:text-text hover:bg-surface-3"
          onClick={toggleDesktop}
        >
          <TextAlignStart className="h-5.5 w-5.5" />
        </button>
        <span>
          {"3DEEZ "}
          {pageName &&
              <span className="font-medium text-text-2">{`/ ${pageName}`}</span>
          }
        </span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className={cn(
          "px-2 py-0.75 rounded-sm text-[9px] tracking-[0.08rem] uppercase border text-accent-3 bg-accent-3/20 border-accent-3",
          { "text-accent bg-accent/20 border-accent": isAdmin }
        )}>
          {user?.role}
        </div>
        <div className="flex items-center justify-center rounded-full w-7 aspect-square text-[10px] border border-border-2 bg-surface-3 text-text-2">
          {user && getInitials(user?.name)}
        </div>
      </div>
    </header>
  )
};

export default Topbar;