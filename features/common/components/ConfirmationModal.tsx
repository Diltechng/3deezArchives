import { ConfirmModalData } from "../contexts/ModalContext";
import Button from "../ui/Button";
import { Modal } from "./Modal";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";

interface ConfirmModalProps extends ConfirmModalData {
  children?: React.Component<"button">;
  resolve: (value: boolean) => void;
  onClose: () => void;
}

export const ConfirmationModal = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant,
  resolve,
  onClose,
}: ConfirmModalProps) => {
  const handleResolve = (value: boolean) => {
    resolve(value);
    onClose();
  }
  return (
    <Modal className="max-w-130">
      <ModalHeader title={title} />
      {message && <ModalBody className="px-5.5 py-5 text-[13px] text-foreground-secondary">
        {message}
      </ModalBody>}
      <ModalFooter>
        <Button
          variant="outlined"
          onClick={() => handleResolve(false)}
        >
          {cancelLabel ?? "Cancel"}
        </Button>
        <Button
          data-variant={variant}
          className="
            data-[variant=danger]:bg-accent-danger data-[variant=danger]:text-text
          "
          onClick={() => handleResolve(true)}
        >
          {confirmLabel ?? "Confirm"}
        </Button>
      </ModalFooter>
    </Modal>
  )
}