"use client"
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useEffect, useState } from "react"

const page = () => {
  const authFetch = useAuthFetch();
  const [info, setInfo] = useState<string>();

  async function makeRequest() {
    const response = await authFetch("/api/me");
    const body = await response.json();
    setInfo(`Email ${body.data.user.email} Count ${body.data.count}`);
  }

  return (
    <div>
      <h1>Home</h1>
      {info && <p>{info}</p>}
      <button onClick={makeRequest}>click me</button>
    </div>
  )
}

export default page
