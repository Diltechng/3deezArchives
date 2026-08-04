import FormField from "@/features/common/components/FormField"
import { Modal } from "@/features/common/components/Modal";
import { ModalBody } from "@/features/common/components/ModalBody";
import { ModalFooter } from "@/features/common/components/ModalFooter";
import { ModalHeader } from "@/features/common/components/ModalHeader";
import { api } from "@/features/common/lib/api";
import { getErrorMessage } from "@/features/common/lib/utils";
import Button from "@/features/common/ui/Button";
import { UpdatePasswordInput, UpdatePasswordSchema } from "@/shared/schemas/account/update.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";

interface UserPasswordFormProps {
  title: string;
  onClose?: () => void;
}

const UserPasswordForm = ({ title, onClose }: UserPasswordFormProps) => {
  const UpdatePasswordFormSchema = UpdatePasswordSchema.extend({
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match"
  });
  type UpdatePasswordFormInput = z.infer<typeof UpdatePasswordFormSchema>;
  
  const { register, handleSubmit, formState: { isLoading, errors } } = useForm({
    resolver: zodResolver(UpdatePasswordFormSchema)
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: UpdatePasswordInput) => {
      const response = await api.patch("/profile/password", data);

      return response;
    },

    onSuccess: () => {
      if (onClose) onClose();
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });

  function onSumbit({ confirmPassword, ...data }: UpdatePasswordFormInput) {
    updatePasswordMutation.mutate(data);
  }
  
  return (
    <Modal>
      <ModalHeader title={title} />
      <ModalBody>
        <form id="update-password-form" onSubmit={handleSubmit(onSumbit)}>
          <div className="grid gap-4">
            <FormField label="Current Password" error={errors.currentPassword}>
              <input {...register("currentPassword")} className="input-core" placeholder="Current password" />
            </FormField>
            <FormField label="New Password" error={errors.newPassword}>
              <input {...register("newPassword")} className="input-core" placeholder="New password" />
            </FormField>
            <FormField label="Confirm New Password" error={errors.confirmPassword}>
              <input {...register("confirmPassword")} className="input-core" placeholder="Confirm new password" />
            </FormField>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button form="update-password-form" disabled={updatePasswordMutation.isPending}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UserPasswordForm;