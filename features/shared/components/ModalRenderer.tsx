import useModal from "../hooks/useModal";
import FormModal from "./FormModal";

const ModalRenderer = () => {
  const { modals, closeModal } = useModal();
  return (
    <>
      {modals.filter(modal => modal.type === "form").map(modal => (
        <FormModal key={modal.id} title={modal.data.title} subtitle={modal.data.subtitle} variant={modal.data.variant}>
          <modal.component
            {...modal.data}
            initialData={modal.data.initialData}
            onClose={() => closeModal(modal.id)}
          />
        </FormModal>
      ))}
    </>
  );
}

export default ModalRenderer;