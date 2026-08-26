import { Bell, Plus, TextAlignStart } from "lucide-react";
import { usePathname } from "next/navigation";
import useSidebar from "../hooks/useSidebar";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { Button } from "../ui/Button";
import { useEventFormModal } from "@/features/events/hooks/useEventFormModal";

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
  const { openAddEventModal } = useEventFormModal();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-9 flex px-3.5 py-2 justify-between border-b border-border bg-background">
      <div className="flex items-center gap-2 font-bold text-[14px] tracking-[0.04rem]">
        <Button
          className="md:hidden w-9 flex justify-center items-center rounded-md"
          variant="outlined"
          onClick={toggleMobile}
        >
          <TextAlignStart className="h-4.5 w-4.5 shrink-0" />
        </Button>
        <Button
          className="hidden md:flex w-9 justify-center items-center rounded-md"
          variant="outlined"
          onClick={toggleDesktop}
        >
          <TextAlignStart className="h-4.5 w-4.5 shrink-0" />
        </Button>
        {/* <span>
          {"3DEEZ "}
          {pageName &&
              <span className="font-medium text-text-2">{`/ ${pageName}`}</span>
          }
        </span> */}
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outlined" className="flex justify-center items-center rounded-md w-9">
          <Bell className="w-4.5 h-4.5 shrink-0" />
        </Button>
        <Button className="px-3 py-1.5 gap-1" onClick={openAddEventModal}>
          <Plus className="w-4 h-4" />
          <span className="font-medium">Add Event</span>
        </Button>
      </div>
    </header>
  )
};

export default Topbar;