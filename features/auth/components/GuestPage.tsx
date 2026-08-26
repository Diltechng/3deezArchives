import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoadingState } from "@/features/common/components/LoadingState";

export const GuestPage = ({ children }: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [router, isLoading, isAuthenticated]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="w-full h-screen">
        <LoadingState />
      </div>
    )
  }

  return children;
}