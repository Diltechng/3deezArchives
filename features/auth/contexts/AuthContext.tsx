"use client"

import { api } from "@/features/shared/lib/api";
import { SignInInput } from "@/shared/schemas";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-toastify";

type AuthStatus =
  | "unknown"
  | "authenticated"
  | "unauthenticated";

type AuthContextType = {
  isLoading: boolean;
  authStatus: AuthStatus;
  isAuthenticated: boolean;
  accessToken: string | null;
  clearSession: () => void;
  refresh: () => Promise<string>;
  signin: (data: SignInInput) => Promise<void>;
  signout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("unknown");
  const refreshPromiseRef = useRef<Promise<string> | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  function clearSession() {
    setAccessToken(null);
    setAuthStatus("unauthenticated");
  }

  function setSession(accessToken: string,) {
    setAccessToken(accessToken);
    setAuthStatus("authenticated")
  }

  const refresh = useCallback(async () => {
    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = (async () => {
        try {
          const response = await axios.post("/api/v1/auth/refresh", {}, { withCredentials: true });
    
          const body = await response.data;
    
          const accessToken: string = body.data.accessToken;
    
          setSession(accessToken);
    
          return accessToken;
        } finally {
          refreshPromiseRef.current = null;
        }
      })();
    }
    return refreshPromiseRef.current;
  }, []);

  async function signin(credentials: SignInInput) {
    try {
      const response = await axios.post("/api/v1/auth/sign-in", credentials);

      const { data } = response.data;
      
      setSession(data.accessToken);

      router.replace("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error.message);
      }
      throw new Error("Something went wrong");
    }
  }

  async function signout() {
    await axios.delete("/api/v1/auth/sign-out");

    router.replace("/auth/signin");
    
    clearSession();
  }

  useEffect(() => {
    async function initializeAuth() {
      try {
        await refresh();
      } catch (error) {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${accessToken}`
        return config;
      },
      (error) => Promise.reject(error),
    );
  
    const responseInterceptor = api.interceptors.response.use(
      response => response,
  
      async error => {
        const originalRequest = error.config;
  
        if (error.response?.status === 401 && !originalRequest._retried) {
          originalRequest._retried = true;
  
          try {
            const accessToken = await refresh();
  
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`
  
            return api(originalRequest);
          } catch (refreshError) {
            clearSession();
            router.replace("/auth/signin");
            return Promise.reject(refreshError);
          }
        }
  
        return Promise.reject(error);
      }
    )
  
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    }
  }, [accessToken]);
  
  const value: AuthContextType = {
    isLoading,
    isAuthenticated: !!accessToken,
    accessToken,
    clearSession,
    refresh,
    signin,
    signout,
    authStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}