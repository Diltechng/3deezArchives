import { useAuth } from "@/features/auth/hooks/useAuth";
import { api } from "@/features/common/lib/api";
import { getErrorMessage } from "@/features/common/lib/utils";
import { QUERY_KEYS } from "@/lib/query-keys";
import { GetUserProfileResponse } from "@/shared/contracts/users.contract";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();
  
  async function getProfile(): Promise<GetUserProfileResponse> {
    try {
      const response = await api.get("/profile");
  
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Something went wrong"));
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: getProfile,
    enabled: isAuthenticated
  });

  return {
    user: data?.data,
    isLoading,
  }
}