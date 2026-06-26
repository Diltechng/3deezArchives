"use client"

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useInvitation } from "@/features/invitation/hooks/useInvitation";
import FormField from "@/features/shared/components/FormField";
import { SubmitButton } from "@/features/shared/components/FormModal";
import { api } from "@/features/shared/lib/api";
import { INVITATION_TOKEN_HEADER } from "@/shared/constants";
import { AcceptInviteSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Ban, MailOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

const AcceptInviteFormSchema = AcceptInviteSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  error: "Passwords do not match"
});

type AcceptInviteFormInput = z.infer<typeof AcceptInviteFormSchema>;

const AccountSetupPage = () => {
  const router = useRouter();
  const { signin } = useAuth();
  const { invitationData } = useInvitation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(AcceptInviteFormSchema)
  });
  
  async function onSumbit({ confirmPassword, ...data }: AcceptInviteFormInput) {
    if (!invitationData) {
      toast.error("Invalid invitation token.");
      return;
    }

    try {
      await api.post("/invitation/accept", data, {
        headers: {
          [INVITATION_TOKEN_HEADER]: `Bearer ${invitationData.token}`
        }
      });

      toast.success("Account created succcessfully");
      
      await signin({
        email: invitationData.email,
        password: data.password
      });
    } catch (error) {
      const message = (axios.isAxiosError(error))
        ? error.response?.data?.error?.message
        : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again";
      
      toast.error(message);
    }
  }

  return (
    <section className="h-full flex justify-center p-10">
      {!invitationData && (
        <div className="my-auto py-8 px-12 min-h-50 h-full max-h-70 min-w-50 w-full max-w-130 flex flex-col gap-4 justify-center items-center rounded-lg text-center border border-border-2 bg-surface">
          <div className="p-3 h-13 aspect-square rounded-full text-accent-2 bg-accent-2/10">
            <Ban className="h-full w-full" />
          </div>
          <div className="font-sans font-bold">
            This page is unavailable
          </div>
          <div className="text-[10px] uppercase text-text-3">
            Please use a valid invitation link to be able to access this page
          </div>
        </div>
      )}
      {invitationData && (
        <div className="w-full max-w-120">
          <form className="p-6 rounded-2xl border border-border-2 bg-surface" onSubmit={handleSubmit(onSumbit)}>
            <div className="grid gap-4">
              <FormField label="Email Address">
                <input className="input-core text-text-2 disabled:cursor-not-allowed" disabled value={invitationData?.email} />    
              </FormField>
              <FormField label="Your Full Name" error={errors.name}>
                <input {...register("name")} type="text" className="input-core" />    
              </FormField>
              <FormField label="Choose Password" error={errors.password}>
                <input {...register("password")} type="password" className="input-core" />    
              </FormField>
              <FormField label="Confirm Password" error={errors.confirmPassword}>
                <input {...register("confirmPassword")} type="password" className="input-core" />    
              </FormField>
              <div className="flex gap-2 items-start">
                <input
                  className="mt-1.5"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(prev => !prev)}
                />
                <p className="text-[12px] font-sans text-text-2">
                  I understand that uploading files to the 3Deez events media archive is subject to the company terms of service and file handling policies.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border-2">
              <SubmitButton className="w-full py-3 text-[13px]" disabled={!termsAccepted || isSubmitting} />
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default AccountSetupPage;