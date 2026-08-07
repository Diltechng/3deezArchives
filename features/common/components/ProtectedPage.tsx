"use client"

import { useAuth } from "@/features/auth/hooks/useAuth"
import LoadingState from "./LoadingState"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, authStatus, isWhiteListed } = useAuth();
  const isAuthPage = pathname === "/auth" || pathname.startsWith("/auth/");
  const isIndexPage = pathname === "/";

  useEffect(() => {
    if (!isLoading) {
      if (authStatus === "authenticated" && (isAuthPage || isIndexPage)) {
        router.replace("/dashboard");
      } else if (authStatus === "unauthenticated" && !isWhiteListed(pathname)) {
        router.replace("/auth/signin");
      }
    }
  }, [router, authStatus, isLoading]);

  if (isLoading ||
    ((authStatus === "unknown") ||
    (authStatus === "unauthenticated" && !isWhiteListed(pathname)) ||
    (authStatus === "authenticated" && (isAuthPage || isIndexPage)))
  ) {
    return (
      <div className="w-full h-screen">
        <LoadingState />
      </div>
    )
  }

  return children;
}

export default ProtectedPage;