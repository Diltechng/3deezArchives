import { useAuthContext } from "@/contexts/AuthContext";


export const useAuthFetch = () => {
  const { accessToken, refreshAccessToken } = useAuthContext();

  return async (url: string, init: RequestInit = {}) => {
    console.log(accessToken);

    const headers = new Headers();
    headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(url, {
      ...init,
      headers,
      credentials: "include"
    });

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      console.log(newToken);
    }

    
    return response;
  };
}