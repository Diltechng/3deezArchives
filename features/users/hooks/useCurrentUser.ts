import { useAuth } from "@/features/auth/hooks/useAuth";
import { api } from "@/features/shared/lib/api";
import { getErrorMessage } from "@/features/shared/lib/utils";
import { GetUserProfileResponse } from "@/shared/contracts/users";
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
    queryKey: ["me"],
    queryFn: getProfile,
    enabled: isAuthenticated
  });

  return {
    user: data?.data,
    isLoading,
  }
}