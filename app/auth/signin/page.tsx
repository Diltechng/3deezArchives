"use client"
import { SignInInput, SignInSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import logo from "@/public/3deez-logo.svg";
import Image from "next/image";
import { useAuth } from "@/features/auth/hooks/useAuth";

const SignInPage = () => {
  const { signin } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema)
  });

  async function onSubmit(data: SignInInput) {
    try {
      await signin(data);
    } catch (error) {
      toast.error((error instanceof Error)
        ? error.message
        : "Something went wrong"
      );
    }

  }

  return (
    <div className="flex w-full h-screen overflow-x-auto">
      <div className="flex flex-col gap-5 h-full sm:h-fit py-10 sm:min-w-50 w-full sm:max-w-100 shadow-2xl sm:border sm:rounded-2xl my-auto mx-auto border-border-2">
        <div className="flex flex-col gap-3 text-center">
          <div className="mx-auto">
            <Image
              src={logo}
              alt="Company Logo"
              className="w-33"
            />
          </div>
          <h2 className="text-sm text-neutral-600">
            Archives members only
          </h2>
        </div>
        <form
          className="flex flex-col w-full max-w-100 mx-auto border-t pt-7 px-10 border-border-2" 
          method="POST"
          onSubmit={handleSubmit(onSubmit)} >
          
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="text-[13px] text-neutral-700">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="input-core" />
              {errors.email && <p className="ml-2 text-[13px] text-red-600">{"* " + errors.email.message}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-[13px] text-neutral-700">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="input-core" />
              <button type="button">

              </button>
              {errors.password && <p className="ml-2 text-[13px] text-red-600">{"* " + errors.password.message}</p>}
            </div>
          </div>

          <Link href="#" className="text-[13px] my-5 text-right text-sky-600" >Forgot password</Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary disabled:bg-neutral-700">
            {isSubmitting? "Signing in...": "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignInPage;