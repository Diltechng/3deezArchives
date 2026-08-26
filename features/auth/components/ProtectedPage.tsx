"use client"

import { useAuth } from "@/features/auth/hooks/useAuth"
import { LoadingState } from "../../common/components/LoadingState"
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated } = useAuth();
  const isIndexPage = pathname === "/";

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && isIndexPage) {
        router.replace("/dashboard");
      } else if (!isAuthenticated) {
        router.replace("/auth/signin");
      }
    }
  }, [router, isAuthenticated, isLoading]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="w-full h-screen">
        <LoadingState />
      </div>
    )
  }

  return children;
}

export { ProtectedPage };