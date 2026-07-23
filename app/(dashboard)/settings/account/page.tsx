"use client"

import { useAuth } from "@/features/auth/hooks/useAuth";
import SettingsItem from "@/features/settings/components/SettingsItems";
import UserEmailForm from "@/features/settings/components/UserEmailForm";
import UserFullNameForm from "@/features/settings/components/UserFullNameForm";
import UserPasswordForm from "@/features/settings/components/UserPasswordForm";
import ContentHeader from "@/features/shared/components/ContentHeader"
import useModal from "@/features/shared/hooks/useModal";
import { CircleOff } from "lucide-react";

const AccountSettingsPage = () => {
  const { user } = useAuth();
  const { openFormModal } = useModal();

  return (
    <>
      <ContentHeader title="Account" subtitle="" />
      {!user
        ? (
          <div className="h-full w-full grid place-items-center font-medium text-lg text-text-2">
            <div className="flex flex-col items-center gap-4 mb-30">
              <CircleOff />
              Unavailable
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
            <SettingsItem label="Email" value={user.email} onEdit={() => {
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