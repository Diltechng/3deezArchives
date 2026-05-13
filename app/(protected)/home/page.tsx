"use client"
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useEffect } from "react"

const page = () => {
  const authFetch = useAuthFetch();

  async function makeRequest() {
    await authFetch("/api/home");
  }

  useEffect(() => {

    makeRequest();
  }, []);

  return (
    <div>
      <p>Home</p>
      <button onClick={makeRequest}>click me</button>
    </div>
  )
}

export default page
