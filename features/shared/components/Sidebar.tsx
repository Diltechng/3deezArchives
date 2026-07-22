"use client"

import { useAuth } from "@/features/auth/hooks/useAuth";
import clsx from "clsx";
import { Images, LayoutDashboard, LogOut, Settings, SquareActivity, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSidebar from "../hooks/useSidebar";
import { cn } from "../lib/utils";
import BackgroundOverlay from "./BackgroundOverlay";
import { useEffect } from "react";

const Sidebar = () => {
  const { signout } = useAuth();
  const { mobileOpen, desktopOpen, closeMobile } = useSidebar();
  const pathname = usePathname();

  const navGroups = [{
    name: "MAIN",
    navOptions: [
      { name: "Dashboard", pathname: "/dashboard", icon: LayoutDashboard },
      { name: "Gallery", pathname: "/gallery", icon: Images }
    ]
  }, {
    name: "ADMIN",
    navOptions: [
      { name: "Users", pathname: "/users", icon: Users },
      { name: "Settings", pathname: "/settings", icon: Settings },
      { name: "Activity Logs", pathname: "/activity-logs", icon: SquareActivity }
    ]
  }];

  useEffect(() => {
    closeMobile();
  }, [pathname]);

  return (
    <BackgroundOverlay className={cn("p-0 hidden md:block md:relative", { "block": mobileOpen })} onClick={closeMobile}>
      <aside
        className={cn(
          "flex flex-col h-full px-3 py-5 w-fit border-r border-border bg-surface-2 overflow-y-auto",
          {"w-50": desktopOpen},
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col flex-1 justify-between">
          <nav className={cn("flex flex-col gap-1", {"gap-4": desktopOpen})} role="navigation">
            {navGroups.map(group => (
              <div key={group.name} className="flex flex-col gap-1">
                {desktopOpen? <p className="px-2 text-[9px] tracking-widest text-text-3">{group.name}</p>: null}
                
                <ul className="flex flex-col gap-1">
                  {group.navOptions.map(item => {
                    const isActivePage = (item.pathname === pathname || pathname.startsWith(`${item.pathname}/`));
                    
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.pathname}
                          className={clsx(
                            "flex items-center gap-2 py-2 px-2.5 w-full text-[12px] text-left font-sans rounded-lg duration-200",
                            isActivePage? "bg-accent/10 text-accent": "text-text-2 hover:text-text hover:bg-surface-3",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {desktopOpen? item.name: ""}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <button
            onClick={signout}
            className="py-2 px-2.5 flex items-center gap-2 text-sm font-sans font-[12px] text-left rounded-lg duration-200 text-accent-2 hover:bg-surface-3"
          >
            <LogOut className="h-4 w-4" />
            {desktopOpen? "Sign Out": ""}
          </button>
        </div>
      </aside>
    </BackgroundOverlay>
  );
}

export default Sidebar;