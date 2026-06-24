"use client"

import { useAuth } from "@/features/auth/hooks/useAuth"
import LoadingState from "./LoadingState"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const { isLoading, authStatus } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (authStatus === "authenticated" && (isAuthPage || pathname === "/")) {
        router.replace("/dashboard");
      } else if (authStatus === "unauthenticated") {
        router.replace("/auth/signin");
      }
    }
  }, [router, authStatus, isLoading]);

  if (isLoading ||
    ((authStatus === "unknown") ||
    (authStatus === "unauthenticated" && !isAuthPage) ||
    (authStatus === "authenticated" && (isAuthPage || pathname === "/")))
  ) {
    return (
      <div className="flex w-full h-screen">
        <LoadingState />
      </div>
    )
  }

  return <>{children}</>;
}

export default ProtectedPage;