"use client"

import { useInvitation } from "@/features/invitation/hooks/useInvitation";
import LoadingSpinner from "@/features/shared/components/LoadingSpinner";
import { api } from "@/features/shared/lib/api";
import { INVITATION_TOKEN_HEADER } from "@/shared/constants";
import { Check, MailOpen } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

type InvitationState = "loading" | "valid" | "invalid";

const AcceptInvitationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { handleSetInvitationData } = useInvitation();
  const [invitationState, setInvitationState] = useState<InvitationState>("loading")

  useEffect(() => {
    async function verifyInvitation() {
      if (!token) {
        setInvitationState("invalid");
        return;
      }

      try {
        const response = await api.get("/invitation/verify", {
          headers: {
            [INVITATION_TOKEN_HEADER]: `Bearer ${token}`
          }
        });

        const { data } = response.data;

        handleSetInvitationData({
          email: data.email,
          role: data.role,
          token,
        });

        setInvitationState("valid");
        router.push(`/invitation/accept/setup-account`);
      } catch (error) {
        setInvitationState("invalid");
      }
    }

    verifyInvitation();
  }, []);

  return (
    <section className="h-full flex justify-center items-center p-10">
      {invitationState === "loading" && (
        <div className="py-8 px-12 min-h-50 h-full max-h-70 min-w-50 w-full max-w-130 flex flex-col gap-4 justify-center items-center rounded-lg text-center border border-border-2 bg-surface">
          <LoadingSpinner />
          <div className="font-sans font-bold">
            Verifying Invitation Token
          </div>
          <div className="text-[11px] uppercase text-text-3 animate-pulse">
            Retrieving workspace configuration...
          </div>
        </div>
      )}

      {invitationState === "invalid" && (
        <div className="py-8 px-12 min-h-50 h-full max-h-70 min-w-50 w-full max-w-130 flex flex-col gap-4 justify-center items-center rounded-lg text-center border border-border-2 bg-surface">
          <div className="p-3 h-13 aspect-square rounded-full text-accent-2 bg-accent-2/10">
            <MailOpen className="h-full w-full" />
          </div>
          <div className="font-sans font-bold">
            This invitation link is no longer valid
          </div>
          <div className="text-[10px] uppercase text-text-3">
            Workspace invitations expire after 7 days, or they may have been revoked by the workspace administrator.
          </div>
        </div>
      )}

      {invitationState === "valid" && (
        <div className="py-8 px-12 min-h-50 h-full max-h-70 min-w-50 w-full max-w-130 flex flex-col gap-4 justify-center items-center rounded-lg text-center border border-border-2 bg-surface">
          <div className="p-3 h-13 aspect-square rounded-full text-accent-3 bg-accent-3/10">
            <Check className="h-full w-full" />
          </div>
          <div className="font-sans font-bold">
            Verification successfull
          </div>
          <div className="text-[10px] uppercase text-text-3 animate-pulse">
            Redirecting to account set up page...
          </div>
        </div>
      )}

    </section>
  )
}

export default AcceptInvitationPage