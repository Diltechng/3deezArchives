import { useAuthContext } from "@/contexts/AuthContext";
import { Home, Images, Menu, Settings, SquareActivity, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
  const { deleteAccessToken } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarExpanded, setSidebarExpanded] = useState(() => window.innerWidth >= 768);


  async function signout() {
    await fetch("/api/v1/auth/sign-out", {
      method: "DELETE"
    });

    deleteAccessToken();

    router.replace("/auth/signin");
  }

  const navGroups = [{
    name: "Main",
    navOptions: [
      { name: "Dashboard", pathname: "/dashboard", icon: Home },
      { name: "Gallery", pathname: "/gallery", icon: Images }
    ]
  }, {
    name: "Admin",
    navOptions: [
      { name: "Users", pathname: "/users", icon: Users },
      { name: "Settings", pathname: "/settings", icon: Settings },
      { name: "Activity Logs", pathname: "/activity-logs", icon: SquareActivity }
    ]
  }];

  return (
    <aside className={`flex flex-col px-3 py-3 border-r border-border-primary bg-neutral-50 ${sidebarExpanded? "w-60":"w-18"}`}>
      <button
        className={`w-10 p-1.5 aspect-square mb-7 rounded-lg duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-500/10
          ${sidebarExpanded? "ml-2": "mx-auto"}
        `}
        onClick={() => setSidebarExpanded(prev => !prev)}
      >
        <Menu className="w-full h-full" />
      </button>
      <div className="flex flex-col flex-1 justify-between">
        <nav className={`flex flex-col ${sidebarExpanded? "gap-4": "gap-1"}`} role="navigation">
          {navGroups.map(group => (
            <div key={group.name} className="flex flex-col gap-1">
              {sidebarExpanded && <p className="text-[13px] text-gray-400 px-2">{group.name}</p>}
              
              <ul className="flex flex-col gap-1">
                {group.navOptions.map(item => {
                  const isActivePage = (item.pathname === pathname || item.pathname.startsWith(`${pathname}/`));
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.pathname}
                        className={`flex items-center gap-1 h-10 py-2.5 w-full text-sm text-left rounded-lg duration-200 hover:text-gray-600 hover:bg-gray-500/10
                          ${isActivePage? "bg-gray-500/15 text-gray-700": "text-gray-500"}
                          ${sidebarExpanded? "px-6": "px-2.5 justify-center"}
                        `}
                      >
                        <item.icon className="h-full aspect-square" />
                        {sidebarExpanded && <span>{item.name}</span>}
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
          className="px-6 py-2 text-sm text-left rounded-lg duration-200 text-red-700 hover:bg-red-500/10"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;