"use client"
import { useAuthFetch } from "@/hooks/useAuthFetch";
import Image from "next/image";
import { useState } from "react";

const HomePage = () => {
  const authFetch = useAuthFetch();
  const [info, setInfo] = useState<string>();

  async function makeRequest() {
    const response = await authFetch("/api/v1/users/me");
    const body = await response.json();
    if (body.data)
      setInfo(`Email ${body.data.user.email} Count ${body.data.count}`);
  }
  
  return (
    <div>Dashboard</div>
  )
}

export default HomePage;
