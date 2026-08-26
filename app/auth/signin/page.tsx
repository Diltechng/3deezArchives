"use client"
import { SignInInput, SignInSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import logo from "@/public/3deez-logo.svg";
import Image from "next/image";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/features/common/ui/Button";
import { FormField } from "@/features/common/components/FormField";
import { Input } from "@/features/common/ui/Input";
import { AlertTriangle, Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { useState } from "react";
import { LoadingSpinner } from "@/features/common/components/LoadingSpinner";
import { getErrorMessage } from "@/features/common/lib/utils";

const SignInPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signin } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema)
  });

  async function onSubmit(data: SignInInput) {
    setError(null);

    try {
      await signin(data);
    } catch (error) {
      setError(getErrorMessage(error));
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
          onSubmit={handleSubmit(onSubmit)}
        >
          {error && (
            <div className="mb-5 p-3 flex items-center gap-1 rounded-lg border border-accent-danger bg-accent-danger/10">
              <div className="p-1.5">
                <AlertTriangle className="size-5" />
              </div>
              <p>{error}</p>
              <Button
                variant="text"
                onClick={() => setError(null)}
                className="ml-auto p-1.5 text-text hover:bg-accent-danger/10">
                <X className="size-5" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-col gap-5">
            <FormField label="Email" error={errors.email}>
              <div className="relative">
                <div className="absolute -translate-y-1/2 top-1/2 left-2 p-1.5">
                  <Mail className="size-4.5" />
                </div>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-11"
                />
              </div>
            </FormField>
            <FormField label="Password" error={errors.password}>
              <div className="relative">
                <div className="absolute -translate-y-1/2 top-1/2 left-2 p-1.5">
                  <Lock className="size-4.5" />
                </div>
                <Input
                  {...register("password")}
                  type={passwordVisible ? "text": "password"}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-10"
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