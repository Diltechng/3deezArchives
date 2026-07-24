import FormField from "@/features/shared/components/FormField"
import { CancelButton, SubmitButton } from "@/features/shared/components/FormModal";
import { api } from "@/features/shared/lib/api";
import { getErrorMessage } from "@/features/shared/lib/utils";
import { UpdateFullNameInput, UpdateFullNameSchema } from "@/shared/schemas/account/update.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface UserFullNameFormProps {
  onClose?: () => void;
}

const UserFullNameForm = ({ onClose }: UserFullNameFormProps) => {
  const { register, handleSubmit, formState: { isLoading, errors } } = useForm({
    resolver: zodResolver(UpdateFullNameSchema)
  });

  const queryClient = useQueryClient();

  const updateFullNameMutation = useMutation({
    mutationFn: async (data: UpdateFullNameInput) => {
      const response = await api.patch("/profile/name", data);

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });

      if (onClose) onClose();
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });

  async function onSubmit(data: UpdateFullNameInput) {
    updateFullNameMutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Full Name" error={errors.name}>
        <input {...register("name")} className="input-core" placeholder="Full name" />
      </FormField>

      <div className="flex gap-2 pt-3 justify-end mt-auto">
        <CancelButton onClick={onClose} />
        <SubmitButton disabled={updateFullNameMutation.isPending} />
      </div>
    </form>
  )
}

export default UserFullNameForm;