import FormField from "@/features/common/components/FormField"
import { Modal } from "@/features/common/components/Modal";
import { ModalBody } from "@/features/common/components/ModalBody";
import { ModalFooter } from "@/features/common/components/ModalFooter";
import { ModalHeader } from "@/features/common/components/ModalHeader";
import { api } from "@/features/common/lib/api";
import { getErrorMessage } from "@/features/common/lib/utils";
import Button from "@/features/common/ui/Button";
import { UpdateFullNameInput, UpdateFullNameSchema } from "@/shared/schemas/account/update.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface UserFullNameFormProps {
  title: string;
  onClose?: () => void;
}

const UserFullNameForm = ({ title, onClose }: UserFullNameFormProps) => {
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
    <Modal>
      <ModalHeader title={title} />
      <ModalBody>
        <form id="update-full-name-form" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Full Name" error={errors.name}>
            <input {...register("name")} className="input-core" placeholder="Full name" />
          </FormField>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button form="update-full-name-form" disabled={updateFullNameMutation.isPending}>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UserFullNameForm;