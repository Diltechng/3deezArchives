"use client"
import { useRef, useState } from "react";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const emailRef = useRef(null);
  const fullNameRef = useRef(null);
  
  console.log(email);
  return (
    <div>
      <input
        ref={emailRef}
        value={email}
        onChange={e => setEmail(e.target.value)} />
      
      <input
        ref={fullNameRef}
        value={fullName}
        onChange={e => setFullName(e.target.value)} />
      
      <button
        disabled={isSending}
        className="bg-gray-100 border-gray-400 text-gray-900 p-2"
        onClick={async () => {
          try {
            setIsSending(true);
            const response = await fetch("/api/auth/register", {
              method: "POST",
              body: JSON.stringify({
                email: "cyber.guru.075@gmail.com",
                fullName: "Ghali Musa"
              })
            });
            console.log(await response.json());
          } catch (error) {
            console.log(error);
          } finally {
            setIsSending(false);
          }
        }}>Send</button>
    </div>
  )
}

export default RegisterPage;