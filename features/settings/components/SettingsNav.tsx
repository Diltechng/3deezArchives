"use client"

import { cn } from "@/features/shared/lib/utils";
import Button from "@/features/shared/ui/Button";
import { CircleUserRound, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const SettingsNav = () => {
  const pathname = usePathname();

  const navItems = [{
    icon: Settings,
    url: "/settings",
    name: "General"
  }, {
    icon: CircleUserRound,
    url: "/settings/account",
    name: "Account"
  }];
  
  return (
    <div className="pr-6 w-full sm:h-full sm:w-50 pb-2 mb-2 sm:pb-0 sm:mb-0 overflow-x-auto">
      <ul className="flex sm:flex-col gap-1">
        {navItems.map((navItem) => (
          <li key={navItem.name}>
            <Button
              href={navItem.url}
              Icon={navItem.icon}
              active={pathname === navItem.url}
            >
              {navItem.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SettingsNav;