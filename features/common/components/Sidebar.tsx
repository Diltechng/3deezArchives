"use client"

import { useAuth } from "@/features/auth/hooks/useAuth";
import { Building2, ChevronsUpDown, Folders, Images, LayoutDashboard, LogOut, Settings, SquareActivity, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSidebar from "../hooks/useSidebar";
import { cn, getInitials } from "../lib/utils";
import BackgroundOverlay from "./BackgroundOverlay";
import { useEffect } from "react";
import { Button } from "../ui/Button";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { DropdownMenu } from "radix-ui";
import logo from "@/public/3deez-logo.svg";
import mobileLogo from "@/public/mobile-logo.webp";
import Image from "next/image";

const Sidebar = () => {
  const { signout } = useAuth();
  const { user } = useCurrentUser();
  const { mobileOpen, desktopOpen, closeMobile } = useSidebar();
  const pathname = usePathname();

  const navGroups = [{
    name: "MAIN",
    navOptions: [
      { name: "Dashboard", pathname: "/dashboard", icon: LayoutDashboard },
      { name: "Gallery", pathname: "/gallery", icon: Images },
      { name: "Categories", pathname: "/categories", icon: Folders },
    ]
  }, {
    name: "ADMIN",
    navOptions: [
      { name: "Organisations", pathname: "/organisations", icon: Building2 },
      { name: "Users", pathname: "/users", icon: Users },
      { name: "Settings", pathname: "/settings", icon: Settings },
      { name: "Activity Logs", pathname: "/activity-logs", icon: SquareActivity },
    ]
  }];

  useEffect(() => {
    closeMobile();
  }, [pathname]);

  return (
    <BackgroundOverlay className={cn("p-0 hidden md:block md:relative", { "block": mobileOpen })} onClick={closeMobile}>
      <aside
        className={cn(
          "flex flex-col h-full px-3 py-5 w-fit border-r border-border bg-background overflow-y-auto",
          {"w-65": desktopOpen},
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col flex-1 justify-between">
          <div className={cn("ml-2 px-2 mb-5 flex gap-2 items-center", { "mx-auto": !desktopOpen })}>
            <Image
              src={mobileLogo}
              loading="lazy"
              alt="Company Mobile Logo"
              className="w-6"
            />
            {desktopOpen && (<div>
              <div className="font-extrabold uppercase">3Deez</div>
              <div className="text-[10px] uppercase tracking-wider text-foreground-secondary">
                Archives
              </div>
            </div>)}
          </div>
          <nav className={cn("flex flex-col gap-1", {"gap-4": desktopOpen})} role="navigation">
            {navGroups.map(group => (
              <div key={group.name} className="flex flex-col gap-1">
                {desktopOpen? <p className="px-2 text-[9px] tracking-widest text-text-3">{group.name}</p>: null}
                
                <ul className="flex flex-col gap-1">
                  {group.navOptions.map(item => {
                    const isActivePage = (item.pathname === pathname || pathname.startsWith(`${item.pathname}/`));
                    
                    return (
                      <li key={item.name}>
                        <Button variant="text" asChild active={isActivePage} className="px-3 py-2.5">
                          <Link
                            href={item.pathname}
                          >
                            <item.icon className="h-4.5 w-4.5" />
                            {desktopOpen? item.name: ""}
                          </Link>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                className={cn("mt-auto mb-1", { "px-1": !desktopOpen })}
                variant="outlined"
              >
                <div className={cn(
                  "grid place-items-center w-8 h-8 text-xs rounded-full bg-accent-secondary",
                  { "w-6 h-6 mx-auto text-[10px]": !desktopOpen }
                )}>
                  {user?.name && getInitials(user.name)}
                </div>
                {desktopOpen && (
                  <>
                    <div>
                    <p>{user?.name}</p>
                    <span className="text-[10px] capitalize text-foreground-secondary">{user?.role}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto w-3 h-3" />
                  </>
                )}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="start" sideOffset={8} className="grid gap-1 p-2 min-w-50 w-(--radix-dropdown-menu-trigger-width) z-10 font-sans rounded-md shadow-md border border-border bg-surface">
                <DropdownMenu.Item asChild>
                  <Button
                    variant="text"
                    className="text-sm hover:bg-surface-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Button
                    variant="text"
                    className="text-sm hover:bg-surface-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-border" />
                <DropdownMenu.Item asChild>
                  <Button
                    variant="text"
                    onClick={signout}
                    className="text-sm text-accent-danger hover:text-accent-danger hover:bg-accent-danger/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </aside>
    </BackgroundOverlay>
  );
}

export default Sidebar;