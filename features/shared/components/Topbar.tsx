import { Bell, Plus, TextAlignStart } from "lucide-react";
import { usePathname } from "next/navigation";
import useSidebar from "../hooks/useSidebar";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import Button from "../ui/Button";

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
    <header className="sticky top-0 z-9 flex px-3.5 py-2 justify-between border-b border-border bg-background">
      <div className="flex items-center gap-2 font-bold text-[14px] tracking-[0.04rem] text-accent-primary">
        <Button
          className="md:hidden p-1.5 rounded-md"
          variant="text"
          onClick={toggleMobile}
        >
          <TextAlignStart className="h-5.5 w-5.5" />
        </Button>
        <Button
          className="hidden md:block p-1.5 rounded-md"
          variant="text"
          onClick={toggleDesktop}
        >
          <TextAlignStart className="h-5.5 w-5.5" />
        </Button>
        <span>
          {"3DEEZ "}
          {pageName &&
              <span className="font-medium text-text-2">{`/ ${pageName}`}</span>
          }
        </span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="text" className="grid place-items-center rounded-full p-1.5">
          <Bell className="w-5.5 h-5.5" />
        </Button>
        <Button className="px-3 py-1.5">
          <Plus className="w-4 h-4" />
          <span className="mt-px">Add Event</span>
        </Button>
      </div>
    </header>
  )
};

export default Topbar;