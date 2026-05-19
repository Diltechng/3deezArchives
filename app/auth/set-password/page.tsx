"use client"
import { useSignUpContext } from "@/contexts/SignUpContext";
import { SetPasswordInput, SetPasswordSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SetPasswordPage = () => {
  const router = useRouter();
  const { userId, deleteSignUpData } = useSignUpContext();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<SetPasswordInput>({
    resolver: zodResolver(SetPasswordSchema)
  });

  async function onSubmit(data: SetPasswordInput) {
    try {
      const response = await fetch("/api/auth/sign-up/set-password", {
        method: "PATCH",
        body: JSON.stringify({
          userId: data.userId,
          password: data.password
        })
      });

      const body = await response.json();
      if (!body.success) {
        toast.error(body.error.message);
        return;
      }

      deleteSignUpData();
      router.push("/");
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
  }, [userId, setValue]);

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col gap-15 h-full sm:h-fit px-10 py-20 sm:min-w-50 w-full sm:max-w-120 shadow-2xl sm:border sm:rounded-2xl my-auto mx-auto border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-3xl font-bold">
            Set Your Password
          </h1>
          <h2 className="font-semibold text-sm text-neutral-600 dark:text-neutral-400">
            Choose a secure password to protect your account 
          </h2>
        </div>
        <form
          className="flex flex-col w-full max-w-100 mx-auto" 
          method="POST"
          onSubmit={handleSubmit(onSubmit)} >
          
          <div className="flex flex-col">
            <label className="label-primary">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="input-primary" />
            {errors.password && <p className="text-[13px] ml-2 text-red-600 dark:text-red-400">{"* " + errors.password.message}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary">
            {isSubmitting? "Sending...": "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SetPasswordPage