import { FormField } from "@/features/common/components/FormField";
import { FormFieldCard } from "@/features/common/components/FormFieldCard";
import { InviteUserInput, InviteUserSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { UserRole } from "@/shared/constants/enums";
import { FormFieldLabel } from "@/features/common/components/FormFieldLabel";
import { cn } from "@/features/common/lib/utils";
import { FormFieldCardTitle } from "@/features/common/components/FormFieldCardTitle";
import { api } from "@/features/common/lib/api";
import { toast } from "react-toastify";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/features/common/components/Modal";
import { ModalHeader } from "@/features/common/components/ModalHeader";
import { ModalFooter } from "@/features/common/components/ModalFooter";
import { Button } from "@/features/common/ui/Button";
import { ModalBody } from "@/features/common/components/ModalBody";
import { Input } from "@/features/common/ui/Input";

interface InviteUserFormModalProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
}

export const InviteUserFormModal = ({ title, subtitle, onClose }: InviteUserFormModalProps) => {
  const queryClient = useQueryClient();
  
  const inviteMutation = useMutation({
    mutationFn: async (data: InviteUserInput) => {
      const response = await api.post("/users", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      
      if (onClose) onClose();
    },
    onError: (error: any) => {
      const message = (axios.isAxiosError(error))
        ? error.response?.data?.error?.message
        : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again";
      
      toast.error(message);
    }
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: {
      role: "staff"
    }
  });

  const selectedRole = useWatch({
    control,
    name: "role"
  });

  async function onSumbit(data: InviteUserInput) {
    inviteMutation.mutate(data);
  }

  const roles = [{
    name: "Admin",
    value: UserRole.ADMIN
  }, {
    name: "Staff",
    value: UserRole.STAFF
  }];

  return (
    <Modal>
      <ModalHeader title={title} subtitle={subtitle} />
      <ModalBody>
        <form id="invite-user-form" className="flex-1 flex flex-col gap-4" onSubmit={handleSubmit(onSumbit)}>
          <FormFieldCard title="Account Info">
            <FormField label="Email Address" error={errors.email}>
              <Input {...register("email")} className="input-core" placeholder="Email address" />
            </FormField>
          </FormFieldCard>
          <FormFieldCard title="Access Role">
            <FormField error={errors.role}>
              <div className="flex gap-2">
                {roles.map(role => (
                  <FormFieldLabel key={role.value} className={cn(
                    "p-2.5 flex-1 tracking-[0.06em] rounded-lg text-center text-[9px] cursor-pointer duration-200 border border-border-primary text-foreground-secondary",
                    {"border-accent-primary text-accent-primary bg-accent-primary/5": (selectedRole === role.value)}
                  )}>
                    <input className="hidden" type="radio" value={role.value} {...register("role")} />
                    <div>
                      <p>{role.name}</p>
                      <p className="mt-0.75 normal-case font-sans text-text-3">Full system access</p>
                    </div>
                  </FormFieldLabel>
                ))}
              </div>
              <FormFieldCardTitle title="Permissions" className="mt-3.5" />
              <div className="grid grid-cols-2 gap-2">
                <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-foreground-secondary bg-surface-primary">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border border-border-primary",
                    {"bg-accent-primary border-transparent": true}
                  )}></div>
                  {" View gallery"}
                </div>
                <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-foreground-secondary bg-surface-primary">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                    {"bg-accent-primary border-transparent": true}
                  )}></div>
                  {" Upload posts"}
                </div>
                <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-foreground-secondary bg-surface-primary">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                    {"bg-accent-primary border-transparent": selectedRole === "admin"}
                  )}></div>
                  {" Delete posts"}
                </div>
                <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-foreground-secondary bg-surface-primary">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                    {"bg-accent-primary border-transparent": selectedRole === "admin"}
                  )}></div>
                  {" Manage users"}
                </div>
                <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-foreground-secondary bg-surface-primary">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                    {"bg-accent-primary border-transparent": selectedRole === "admin"}
                  )}></div>
                  {" Edit categories"}
                </div>
                <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-foreground-secondary bg-surface-primary">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                    {"bg-accent-primary border-transparent": selectedRole === "admin"}
                  )}></div>
                  {" System settings"}
                </div>
              </div>
            </FormField>
          </FormFieldCard>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button form="invite-user-form" type="submit" disabled={inviteMutation.isPending}>
          Submit
        </Button>
      </ModalFooter>
    </Modal>
  )
}