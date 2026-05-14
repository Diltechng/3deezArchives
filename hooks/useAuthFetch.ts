import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


export const useAuthFetch = () => {
  const router = useRouter();
  const { accessToken, refreshAccessToken } = useAuthContext();

  return async (url: string, init: RequestInit = {}) => {
    async function makeRequest(token: string | null | undefined, { retry }: { retry: boolean; }) {
      if (!token) {
        const newToken = await refreshAccessToken();

        if (!newToken)
          throw new Error("Error refreshing token");

        if (retry) {
          return makeRequest(newToken, { retry: false });
        }
      }

      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);

      const response = await fetch(url, {
        ...init,
        headers,
        credentials: "include"
      });

      if (response.status === 401) {
        try {
          const newToken = await refreshAccessToken();
  
          if (retry) {
            return makeRequest(newToken, { retry: false });
          }
        } catch {
          router.replace("/auth/signin");
        }
      }

      return response;
    }

    return makeRequest(accessToken, { retry: true });
  };
}