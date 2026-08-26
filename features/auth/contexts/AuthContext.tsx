"use client"

import { api } from "@/features/common/lib/api";
import { SignInInput } from "@/shared/schemas";
import axios from "axios";
import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { GetUserProfileResponse, UserProfileData } from "@/shared/contracts/users.contract";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserProfileData | null;
  redirectTo: string | null;
  setRedirectTo: Dispatch<SetStateAction<string | null>>;
  signin: (data: SignInInput) => Promise<void>;
  signout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  const refreshPromiseRef = useRef<Promise<string> | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  function clearSession() {
    setAccessToken(null);
    setUser(null);
  }

  function setSession(accessToken: string,) {
    setAccessToken(accessToken);
    setUser(null);
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

  async function getProfile(): Promise<GetUserProfileResponse> {
    try {
      const response = await api.get("/profile");
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error.message);
      }
      throw new Error("Something went wrong");
    }
  }

  async function signin(credentials: SignInInput) {
    try {
      const response = await axios.post("/api/v1/auth/sign-in", credentials);

      const { data } = response.data;
      
      setSession(data.accessToken);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error.message);
      }
      throw new Error("Something went wrong");
    }
  }

  async function signout() {
    await axios.delete("/api/v1/auth/sign-out");
    
    clearSession();
  }

  useEffect(() => {
    async function initializeAuth() {
      try {
        await refresh();
        const { data: user } = await getProfile();
        setUser(user);
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
    user,
    redirectTo,
    setRedirectTo,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}