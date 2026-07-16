import { TextAlignStart } from "lucide-react";
import { usePathname } from "next/navigation";
import useSidebar from "../hooks/useSidebar";

const Topbar = () => {
  const { toggleDesktop, toggleMobile } = useSidebar();
  const pathName = usePathname();
  const routeMap: Record<string, string> = {
    "/dashboard": "archives",
    "/activity-logs": "Activity Logs",
    "/gallery": "Gallery",
    "/users": "Users",
    "/settings": "Settings",
    "/settings/general": "General Settings",
  }
  
  const pageName = routeMap[pathName];

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