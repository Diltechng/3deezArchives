"use client"

import SettingsItem from "@/features/settings/components/SettingsItems";
import UserEmailForm from "@/features/settings/components/UserEmailForm";
import UserFullNameForm from "@/features/settings/components/UserFullNameForm";
import UserPasswordForm from "@/features/settings/components/UserPasswordForm";
import ContentHeader from "@/features/shared/components/ContentHeader"
import LoadingSpinner from "@/features/shared/components/LoadingSpinner";
import useModal from "@/features/shared/hooks/useModal";
import { useCurrentUser } from "@/features/users/hooks/useCurrentUser";
import { CircleOff } from "lucide-react";

const AccountSettingsPage = () => {
  const { user, isLoading } = useCurrentUser();
  const { openFormModal } = useModal();

  return (
    <>
      <ContentHeader title="Account" subtitle="" />
      {isLoading || !user
        ? (
          <div className="h-full w-full grid place-items-center font-medium text-lg text-text-2">
            <div className="flex flex-col items-center gap-4 mb-30">
              {isLoading
                ? (
                  <>
                    <LoadingSpinner radius={8} />
                    Loading
                  </>
                )
                : (
                  <>
                    <CircleOff />
                    Unavailable
                  </>
                )}
            </div>
          </div>
        )
        : (
          <div className="border-t border-border-2">
            <SettingsItem label="Name" value={user.name} onEdit={() => {
              openFormModal(UserFullNameForm, {
                title: "Edit name",
                variant: "compact",
              });
            }} />
            <SettingsItem label="Email" value={user.email} editable={false} onEdit={() => {
              openFormModal(UserEmailForm, {
                title: "Edit email",
                variant: "compact",
              });
            }} />
            <SettingsItem label="Role" value={user.role} editable={false} />
            <SettingsItem label="Password" value="******" onEdit={() => {
              openFormModal(UserPasswordForm, {
                title: "Edit password",
                variant: "compact"
              });
            }} />
          </div>
        )
      }
    </>
  )
}

export default AccountSettingsPage;