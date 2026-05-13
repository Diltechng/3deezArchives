import { useAuthContext } from "@/contexts/AuthContext";


export const useAuthFetch = () => {
  const { accessToken, refreshAccessToken } = useAuthContext();

  return async (url: string, init: RequestInit = {}) => {
    async function makeRequest(token: string | null | undefined, { retry }: { retry: boolean; }) {
      if (!token) {
        const newToken = await refreshAccessToken();
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
        const newToken = await refreshAccessToken();
        if (retry) {
          return makeRequest(newToken, { retry: false });
        }
      }

      return response;
    }

    return makeRequest(accessToken, { retry: true });
  };
}