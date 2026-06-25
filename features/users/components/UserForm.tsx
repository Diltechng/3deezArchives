import FormField from "@/features/shared/components/FormField";
import FormFieldCard from "@/features/shared/components/FormFieldCard";
import { CancelButton, SubmitButton } from "@/features/shared/components/FormModal";
import { InviteUserInput, InviteUserSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { UserRole } from "@/shared/constants/enums";
import FormFieldLabel from "@/features/shared/components/FormFieldLabel";
import { cn } from "@/features/shared/lib/utils";
import FormFieldCardTitle from "@/features/shared/components/FormFieldCardTitle";
import { api } from "@/features/shared/lib/api";
import { toast } from "react-toastify";
import axios from "axios";

const UserForm = ({ onClose }: {
  onClose?: () => void;
}) => {
  const { watch, register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
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
    try {
      const response = await api.post("/users", data);

      console.log(response.data);

      if (onClose) onClose();
    } catch (error: unknown) {
      const message = (axios.isAxiosError(error))
        ? error.response?.data?.error?.message
        : error instanceof Error
          ? error.message
          : "Something went wrong. Please try again";
      
      toast.error(message);
    }
  }

  const roles = [{
    name: "Admin",
    value: UserRole.ADMIN
  }, {
    name: "Staff",
    value: UserRole.STAFF
  }];

  return (
    <form className="flex-1 flex flex-col overflow-hidden" onSubmit={handleSubmit(onSumbit)}>
      <div className="h-full overflow-x-auto">
        <FormFieldCard title="Account Info">
          <FormField label="Email Address" error={errors.email}>
            <input {...register("email")} className="input-core" placeholder="Email address" />
          </FormField>
        </FormFieldCard>
        <FormFieldCard title="Access Role">
          <FormField error={errors.role}>
            <div className="flex gap-2">
              {roles.map(role => (
                <FormFieldLabel key={role.value} className={cn(
                  "p-2.5 flex-1 tracking-[0.06em] rounded-lg text-center text-[9px] cursor-pointer duration-200 border border-border-2 text-text-2",
                  {"border-accent text-accent bg-accent/5": (selectedRole === role.value)}
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
              <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-text-2 bg-surface-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                  {"bg-accent border-transparent": true}
                )}></div>
                {" View gallery"}
              </div>
              <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-text-2 bg-surface-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                  {"bg-accent border-transparent": true}
                )}></div>
                {" Upload posts"}
              </div>
              <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-text-2 bg-surface-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                  {"bg-accent border-transparent": selectedRole === "admin"}
                )}></div>
                {" Delete posts"}
              </div>
              <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-text-2 bg-surface-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                  {"bg-accent border-transparent": selectedRole === "admin"}
                )}></div>
                {" Manage users"}
              </div>
              <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-text-2 bg-surface-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                  {"bg-accent border-transparent": selectedRole === "admin"}
                )}></div>
                {" Edit categories"}
              </div>
              <div className="py-2 px-2.5 flex gap-2 items-center rounded-lg font-sans text-[11px] text-text-2 bg-surface-3">
                <div className={cn(
                  "w-3.5 h-3.5 rounded-[3px] border border-border-2",
                  {"bg-accent border-transparent": selectedRole === "admin"}
                )}></div>
                {" System settings"}
              </div>
            </div>
          </FormField>
        </FormFieldCard>
      </div>
      <div className="flex gap-2 pt-3 justify-end mt-auto">
        <CancelButton onClick={onClose} />
        <SubmitButton disabled={isSubmitting} />
      </div>
    </form>
  )
}

export default UserForm;