"use client"
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const signUpSchema = z.object({
  email: z.email("Invalid email address"),
  fullName: z.string("Please enter a valid name")
    .min(6, "Full name must be at least 6 characters long")
    .max(255, "Full name is too long")
});

type SignUpData = z.infer<typeof signUpSchema>

const SignUpForm = () => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpData) => {
    const { email, fullName } = data;
    try {
      setIsSending(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, fullName })
      });
      const body = await response.json();
      if (!body.success) {
        return;
      }
      console.log(body);
      router.push("/auth/email-verification");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  }
  
  return (
    <div className="flex w-full lg:w-120 h-full px-10">
      <form
        className="flex flex-col min-w-50 w-full max-w-100 my-auto mx-auto" 
        method="POST"
        onSubmit={handleSubmit(onSubmit)} >

        <label className="text-[15px] mb-1 font-semibold dark:text-neutral-300">Email</label>
        <input
          {...register("email")}
          type="text"
          placeholder="Enter you email"
          className="dark:bg-neutral-800 p-3 rounded-md" />
        {errors.email && <p className="text-[13px] ml-2 mt-1 text-red-400">{"* " + errors.email.message}</p>}
        
        <label className="text-[15px] mt-5 mb-1 font-semibold dark:text-neutral-300">Full Name</label>
        <input
          {...register("fullName")}
          type="text"
          placeholder="Enter you full name"
          className="dark:bg-neutral-800 p-3 rounded-md" />
        {errors.fullName && <p className="text-[13px] ml-2 mt-1 text-red-400">{"* " + errors.fullName.message}</p>}
        
        <button
          type="submit"
          disabled={isSending}
          className="dark:bg-gray-100 dark:border-gray-400 dark:text-gray-900 dark:hover:bg-gray-300 dark:active:bg-gray-400 duration-200 p-3 font-semibold rounded-md mt-9">
            {isSending? "Sending...": "Sign Up"}
          </button>
      </form>
    </div>
  )
}

export default SignUpForm;