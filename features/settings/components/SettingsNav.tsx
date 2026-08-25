"use client"

import { cn } from "@/features/common/lib/utils";
import { Button } from "@/features/common/ui/Button";
import { CircleUserRound, Settings } from "lucide-react";
import Link from "next/link";
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
        {navItems.map((navItem) => {
          const Icon = navItem.icon;

          return (
            <li key={navItem.name}>
              <Button
                active={pathname === navItem.url}
                asChild
                variant="text"
                className="px-3 py-2.5"
              >
                <Link href={navItem.url}>
                  <Icon className="size-4.5" />
                  {navItem.name}
                </Link>
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SettingsNav;