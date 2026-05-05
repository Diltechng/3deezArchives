"use client"
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    async function sendVerificationRequest() {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "PATCH",
          body: JSON.stringify({ token })
        });

        console.log(await response.json());
      } catch (error) {
        console.log(error);
      }
    }
    
    sendVerificationRequest();
  }, [token]);
  return (
    <div>
      Verfying Email...
    </div>
  );
}

export default VerificationPage;