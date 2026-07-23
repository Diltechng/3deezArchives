import FormField from "@/features/shared/components/FormField"
import { CancelButton, SubmitButton } from "@/features/shared/components/FormModal";
import { UpdatePasswordSchema } from "@/shared/schemas/account/update.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

interface UserPasswordFormProps {
  onClose?: () => void;
}

const UserPasswordForm = ({ onClose }: UserPasswordFormProps) => {
  const UpdatePasswordFormSchema = UpdatePasswordSchema.extend({
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match"
  });
  type UpdatePasswordFormInput = z.infer<typeof UpdatePasswordFormSchema>;
  
  const { register, handleSubmit, formState: { isLoading, errors } } = useForm({
    resolver: zodResolver(UpdatePasswordFormSchema)
  })

  function onSumbit({ confirmPassword, ...data }: UpdatePasswordFormInput) {
    console.log(data);
  }
  
  return (
    <form onSubmit={handleSubmit(onSumbit)}>
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

      <div className="flex gap-2 pt-3 justify-end mt-auto">
        <CancelButton onClick={onClose} />
        <SubmitButton disabled={isLoading} />
      </div>
    </form>
  )
}

export default UserPasswordForm;