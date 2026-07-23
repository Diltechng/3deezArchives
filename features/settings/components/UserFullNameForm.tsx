import FormField from "@/features/shared/components/FormField"
import { CancelButton, SubmitButton } from "@/features/shared/components/FormModal";
import { UpdateFullNameInput, UpdateFullNameSchema } from "@/shared/schemas/account/update.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UserFullNameFormProps {
  onClose?: () => void;
}

const UserFullNameForm = ({ onClose }: UserFullNameFormProps) => {
  const { register, handleSubmit, formState: { isLoading, errors } } = useForm({
    resolver: zodResolver(UpdateFullNameSchema)
  });

  async function onSubmit(data: UpdateFullNameInput) {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Full Name" error={errors.name}>
        <input {...register("name")} className="input-core" placeholder="Full name" />
      </FormField>

      <div className="flex gap-2 pt-3 justify-end mt-auto">
        <CancelButton onClick={onClose} />
        <SubmitButton disabled={isLoading} />
      </div>
    </form>
  )
}

export default UserFullNameForm;