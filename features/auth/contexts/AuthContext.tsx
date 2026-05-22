import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react"


type AuthContextType = {
  accessToken: string | null | undefined;
  deleteAccessToken: () => void;
  refreshAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");

  return context;
}

export const AuthProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>();
  const router = useRouter();

  let refreshPromise: Promise<string> | null = null;

  const refreshAccessToken = useCallback(async () => {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const response = await fetch("/api/v1/auth/refresh", {
            method: "POST",
            credentials: "same-origin",
          });
    
          if (!response.ok)
            throw new Error("Error refreshing token");
    
          const body = await response.json();
    
          const accessToken: string = body.data.accessToken;
    
          setAccessToken(accessToken);
    
          return accessToken;
        } finally {
          refreshPromise = null;
        }
      })();
  
    }

    return refreshPromise;
  }, []);

  function deleteAccessToken() {
    setAccessToken(null);
  }

  useEffect(() => {
    async function refresh() {
      try {
        await refreshAccessToken();
        setIsInitializing(false);
      } catch (error) {
        setIsInitializing(true);
        router.replace("/auth/signin");
      }
    }

    refresh();
  }, [router]);
  
  const value = {
    accessToken,
    deleteAccessToken,
    refreshAccessToken,
  }

  return (
    isInitializing
    ? (
      <div className="flex w-full h-screen">
        <div className="m-auto">Loading...</div>
      </div>
    )
    : (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    )
  );
}