import FormField from "@/features/common/components/FormField"
import { CancelButton, SubmitButton } from "@/features/common/components/FormModal";

interface UserEmailFormProps {
  onClose?: () => void;
}

const UserEmailForm = ({ onClose }: UserEmailFormProps) => {
  return (
    <form>
      <FormField label="Email">
        <input className="input-core" placeholder="Email address" />
      </FormField>

      <div className="flex gap-2 pt-3 justify-end mt-auto">
        <CancelButton onClick={onClose} />
        <SubmitButton />
      </div>
    </form>
  )
}

export default UserEmailForm;