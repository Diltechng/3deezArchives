import { useAuthContext } from "@/features/auth/contexts/AuthContext";
import clsx from "clsx";
import { Home, Images, Menu, Settings, SquareActivity, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const { deleteAccessToken } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();


  async function signout() {
    await fetch("/api/v1/auth/sign-out", {
      method: "DELETE"
    });

    deleteAccessToken();

    router.replace("/auth/signin");
  }

  const navGroups = [{
    name: "MAIN",
    navOptions: [
      { name: "Dashboard", pathname: "/dashboard", icon: Home },
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

  return (
    <aside className="flex flex-col px-3 py-5 w-50 border-r border-border bg-surface-2 overflow-y-auto">
      {/* <button
        className={`w-10 p-1.5 aspect-square mb-7 rounded-lg duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-500/10
          ${sidebarExpanded? "ml-2": "mx-auto"}
        `}
        onClick={() => setSidebarExpanded(prev => !prev)}
      >
        <Menu className="w-full h-full" />
      </button> */}
      <div className="flex flex-col flex-1 justify-between">
        <nav className="flex flex-col gap-4" role="navigation">
          {navGroups.map(group => (
            <div key={group.name} className="flex flex-col gap-1">
              <p className="px-2 text-[9px] tracking-widest text-text-3">{group.name}</p>
              
              <ul className="flex flex-col gap-1">
                {group.navOptions.map(item => {
                  const isActivePage = (item.pathname === pathname || item.pathname.startsWith(`${pathname}/`));
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.pathname}
                        className={clsx(
                          "flex items-center gap-1 py-2 px-2.5 w-full text-[12px] text-left font-sans rounded-lg duration-200",
                          isActivePage? "bg-accent/10 text-accent": "text-text-2 hover:text-text hover:bg-surface-3",
                        )}
                      >
                        {/* <item.icon className="h-full aspect-square" /> */}
                        <div className="px-0.5"></div>
                        {item.name}
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
          className="py-2 px-2.5 text-sm font-sans font-[12px] text-left rounded-lg duration-200 text-accent-2 hover:bg-surface-3"
        >
          <div className="px-0.5"></div>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;