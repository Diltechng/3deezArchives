"use client"

import Button from "@/features/shared/ui/Button";
import { CircleUserRound, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const SettingsSidebar = () => {
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
    <div className="pr-6 h-full w-50">
      <ul className="grid gap-1">
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

export default SettingsSidebar;