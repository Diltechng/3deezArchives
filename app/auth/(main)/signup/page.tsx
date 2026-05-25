"use client"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUpContext } from "@/contexts/SignUpContext";
import { SignUpInput, SignUpSchema } from "@/shared/schemas";
import Link from "next/link";
import { toast } from "react-toastify";


const SignUpPage = () => {
  const { saveSignUpData } = useSignUpContext();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting }  } = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema)
  });

  const onSubmit = async (data: SignUpInput) => {
    const { email } = data;
    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      const body = await response.json();
      if (!body.success) {
        toast.error(body.error.message);
        return;
      }

      const userId = body.data.userId;

      saveSignUpData({ email, userId });
      router.push("/auth/verify");
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  }
  
  return (
    <div className="flex flex-col gap-15 h-full sm:h-fit px-10 py-20 sm:min-w-50 w-full sm:max-w-120 shadow-2xl sm:border sm:rounded-2xl my-auto mx-auto border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold">
          Create your free account
        </h1>
        <h2 className="font-semibold text-sm text-neutral-600 dark:text-neutral-400">
          Already have an account? <Link className="text-sky-500" href="/auth/signin">Sign In</Link>
        </h2>
      </div>
      <form
        className="flex flex-col w-full max-w-100 mx-auto" 
        method="POST"
        onSubmit={handleSubmit(onSubmit)} >
        <label className="label-primary">Email</label>
        <input
          {...register("email")}
          type="email"
          placeholder="Enter your email"
          className="input-primary" />
        {errors.email && <p className="ml-2 error-primary">{"* " + errors.email.message}</p>}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary">
          {isSubmitting? "Sending...": "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default SignUpPage;