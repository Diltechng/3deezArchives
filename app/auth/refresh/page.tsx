"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const RefreshPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    async function refresh() {
      const response = await fetch("/api/auth/refresh", {
        method: "POST"
      });

      const body = await response.json();
      if (!body.success) {
        router.push("/auth/signin");
        return;
      }

      console.log(body.data);
    }

    refresh();
  }, []);



  return (
    <div>Verifying</div>
  )
}

export default RefreshPage;