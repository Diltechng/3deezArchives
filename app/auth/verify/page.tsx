"use client"

import { useSignUpContext } from "@/features/auth/contexts/SignUpContext";
import { VerifyEmailInput, VerifyEmailSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TokenInput from "@/features/auth/components/TokenInput";
import { toast } from "react-toastify";


const VerificationPage = () => {
  const [isSendingCode, setIsSendingCode] = useState(false);
  const { email, userId } = useSignUpContext();
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<VerifyEmailInput>({
    resolver: zodResolver(VerifyEmailSchema)
  });
  const RESEND_AFTER = 30 * 1000;
  const [resendCooldown, setResendCooldown] = useState<number>(30000);
  const resendTimerRef = useRef<NodeJS.Timeout | null>(null);

  function startCooldown() {
    const now = Date.now();
    setResendCooldown(30000);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown(() => {
        const timeLeft = (now + RESEND_AFTER) - Date.now();
        if (timeLeft <= 1) {
          clearTimeout(resendTimerRef.current!)
          resendTimerRef.current = null
          return 0;
        }
        return timeLeft;
      });
    }, 1000);
  }

  async function handleResendOtp() {
    try {
      setIsSendingCode(true);
      const response = await fetch("/api/auth/sign-up/verification/resend", {
        method: "POST",
        body: JSON.stringify({ userId })
      });
      
      const body = await response.json();
      if (!body.success) {
        toast.error(body.error.message);
        return;
      }
      startCooldown();
    } catch (error: any) {
      toast.error("Something went wrong, please try again.");
    } finally {
      setIsSendingCode(false)
    }
  }

  async function onSubmit(data: VerifyEmailInput) {
    try {
      const response = await fetch("/api/auth/sign-up/verification/verify", {
        method: "PATCH",
        body: JSON.stringify(data)
      });

      const body = await response.json();

      if (!body.success) {
        toast.error(body.error.message);
        return;
      }

      router.push("/auth/set-password");
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  }

  useEffect(() => {
    if (userId === null)
      router.push("/auth/signup");

    if (userId) {
      setValue("userId", userId);
    }

    startCooldown();

    return () => clearInterval(resendTimerRef.current!);
  }, [userId, setValue]);

  return (
    <div className="flex h-screen">
      <div className="flex flex-col gap-15 h-full sm:h-fit px-10 py-20 sm:min-w-50 w-full sm:max-w-120 shadow-2xl sm:border sm:rounded-2xl my-auto mx-auto border-neutral-200 dark:border-neutral-800">
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="PATCH"
          className="flex flex-col mx-auto items-center text-center">

          <label className="label-primary text-3xl">Verification Code</label>
          <div className="text-sm mb-4">
            <p>
              We sent a verification code to the email <span className="text-sky-600">{email}</span>.
            </p>
            <p>
              Please check your inbox and paste the 6-digit code above.
            </p>
          </div>

          <Controller
            name="token"
            control={control}
            render={({ field }) => (
              <TokenInput {...field} />
            )}
          />
          {errors.token && <p className="error-primary">{"*"+errors.token.message + "*"}</p>}

          <div className="flex gap-1 text-sm mt-4">
            <p>Didn't receive code?</p>
            {resendCooldown
              ? <span className="text-neutral-600 dark:text-neutral-400">{Math.round(resendCooldown/1000) + "s"}</span>
              : <button
                  className="text-sky-600 disabled:text-neutral-400 dark:disabled:text-neutral-600"
                  disabled={isSendingCode}
                  type="button"
                  onClick={handleResendOtp}>Resend</button>}
          </div>

          <button
            type="submit"
            className="btn-primary px-5 py-2 mt-4"
            disabled={isSubmitting}
          >{isSubmitting? "Sending...": "Confirm code"}</button>
        </form>
      </div>
    </div>
  );
}

export default VerificationPage;