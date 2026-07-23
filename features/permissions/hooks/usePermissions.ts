import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission } from "@/shared/constants/permissions";
import { hasPermission } from "@/shared/constants/policies";

function usePermissions() {
  const { user } = useAuth();

  const has = (permission: Permission) => {
    if (!user?.role)
      return false;

    return hasPermission(user.role, permission);
  }
  
  return {
    has,
  }
}

export default usePermissions;