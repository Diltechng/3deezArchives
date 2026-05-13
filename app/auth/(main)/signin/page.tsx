"use client"
import { SignInInput, SignInSchema } from "@/lib/schemas/sign-in.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SignInPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema)
  });

  async function onSubmit(data: SignInInput) {
    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(data)
      });

      const body = await response.json();
      if (!body.success) {
        toast.error(body.error.message);
        return;
      }

      console.log(body.data);

      router.push("/");
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  }
  
  return (
    <div className="flex flex-col gap-15 h-full sm:h-fit px-10 py-20 sm:min-w-50 w-full sm:max-w-120 shadow-2xl sm:border sm:rounded-2xl my-auto mx-auto border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold">
          Sign in to your account
        </h1>
        <h2 className="font-semibold text-sm text-neutral-600 dark:text-neutral-400">
          Don't have an account? <Link className="text-sky-500" href="/auth/signup">Sign up</Link>
        </h2>
      </div>
      <form
        className="flex flex-col w-full max-w-100 mx-auto" 
        method="POST"
        onSubmit={handleSubmit(onSubmit)} >
        
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label className="label-primary">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="input-primary" />
            {errors.email && <p className="ml-2 error-primary">{"* " + errors.email.message}</p>}
          </div>
          <div className="flex flex-col">
            <label className="label-primary">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="input-primary" />
            <button type="button">

            </button>
            {errors.password && <p className="ml-2 error-primary">{"* " + errors.password.message}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary">
          {isSubmitting? "Sending...": "Sign In"}
        </button>
      </form>
    </div>
  )
}

export default SignInPage;