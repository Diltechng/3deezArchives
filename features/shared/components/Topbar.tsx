import { usePathname } from "next/navigation";

const Topbar = () => {
  const pathName = usePathname();
  const routeMap: Record<string, string> = {
    "/dashboard": "archives",
    "/activity-logs": "Activity Logs",
    "/gallery": "Gallery",
    "/users": "Users",
    "/users/invitations": "User Invitations",
    "/settings": "Settings",
    "/settings/general": "General Settings",
  }
  
  const pageName = routeMap[pathName];

  return (
    <header className="flex px-5 py-3 justify-between border-b border-border bg-surface-2">
      <div className="font-bold text-[14px] tracking-[0.04rem] text-accent">
        {"3DEEZ "}
        {pageName &&
            <span className="font-medium text-text-2">{`/ ${pageName}`}</span>
        }
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="px-2 py-0.75 rounded-sm text-[9px] tracking-[0.08rem] text-accent bg-accent/20 border border-accent">
          ADMIN
        </div>
        <div className="flex items-center justify-center rounded-full w-7 aspect-square text-[10px] border border-border-2 bg-surface-3 text-text-2">
          DA
        </div>
      </div>
    </header>
  )
};

export default Topbar;