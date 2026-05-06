"use client"

import { useState } from "react";


const VerificationPage = () => {
  const [otp, setOtp] = useState("");


  function handleSetOtp(event: any) {
    const otp = event.target.value;
    if (!/^\d*$/.test(otp))
      return;

    setOtp(otp);
  }

  return (
    <div className="flex h-screen">
      <form
        method="POST"
        className="flex flex-col m-auto text-center">
        <label>Verification code</label>
        <input
          className="dark:bg-neutral-800 text-center p-1 rounded-md"
          type="text"
          inputMode="numeric"
          placeholder="XXXXXX"
          maxLength={6}
          value={otp}
          onChange={handleSetOtp}
          />

          <button
            type="submit"
            className="dark:bg-gray-100 dark:border-gray-400 dark:text-gray-900 dark:hover:bg-gray-300 dark:active:bg-gray-400 duration-200 p-1 font-semibold rounded-md mt-2"
          >Send</button>
      </form>
    </div>
  );
}

export default VerificationPage;