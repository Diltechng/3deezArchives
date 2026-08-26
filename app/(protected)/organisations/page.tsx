"use client"

import { useState } from "react"

const OrganisationsPage = () => {
  const [input, setInput] = useState({ name: "" });

  return (
    <div>
      <input value={input.name} onChange={e => setInput((prev) => ({ ...prev, name: e.target.value }))} />
    </div>
  )
}

export default OrganisationsPage;