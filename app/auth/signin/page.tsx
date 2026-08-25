"use client"
import { SignInInput, SignInSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import logo from "@/public/3deez-logo.svg";
import Image from "next/image";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/features/common/ui/Button";
import FormField from "@/features/common/components/FormField";
import { Input } from "@/features/common/ui/Input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "@/features/common/components/LoadingSpinner";

const SignInPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
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
            <FormField label="Email" error={errors.email}>
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
              />
            </FormField>
            <FormField label="Password" error={errors.password}>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={passwordVisible ? "text": "password"}
                  placeholder="Enter your password"
                  className="w-full pr-10"
                />
                <Button
                  variant="text"
                  type="button"
                  className="absolute -translate-y-1/2 top-1/2 right-2 p-1.5 rounded-full"
                  onClick={() => setPasswordVisible(prev => !prev)}
                >
                  {passwordVisible
                    ? <EyeOff className="size-5" />
                    : <Eye className="size-5" />
                  }
                </Button>
              </div>
            </FormField>
          </div>

          <Link href="#" className="text-[13px] my-5 text-right text-sky-600" >Forgot password</Link>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-3 py-2.5 justify-center disabled:bg-neutral-700"
          >
            {isSubmitting
              ? <LoadingSpinner radius={5} />
              : "Sign In"
            }
          </Button>
        </form>
      </div>
    </div>
  )
}

export default SignInPage;