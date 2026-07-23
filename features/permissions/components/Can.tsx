import { Permission } from "@/shared/constants/permissions";
import usePermissions from "../hooks/usePermissions";

interface Canprops {
  children: React.ReactNode;
  permission: Permission;
  action?: "hide" | "disable";
}

const Can = ({ children, permission, action = "hide" }: Canprops) => {
  const { has } = usePermissions();

  const isAllowed = has(permission);

  if (!isAllowed) {
    if (action === "disable")
      return (
        <div
          className="opacity-50 cursor-not-allowed *:pointer-events-none"
        >
          {children}
        </div>
      );

    return null;
  }

  return <>{children}</>
}

export default Can;