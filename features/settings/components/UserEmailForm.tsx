import FormField from "@/features/common/components/FormField"
import { Modal } from "@/features/common/components/Modal";
import { ModalBody } from "@/features/common/components/ModalBody";
import { ModalFooter } from "@/features/common/components/ModalFooter";
import { ModalHeader } from "@/features/common/components/ModalHeader";
import { Button } from "@/features/common/ui/Button";

interface UserEmailFormProps {
  title: string;
  onClose?: () => void;
}

const UserEmailForm = ({ title, onClose }: UserEmailFormProps) => {
  return (
    <Modal size="small">
      <ModalHeader title={title} />
      <ModalBody>
        <form>
          <FormField label="Email">
            <input className="input-core" placeholder="Email address" />
          </FormField>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button>
          Update
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UserEmailForm;