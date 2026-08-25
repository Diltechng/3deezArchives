import { useModal } from "../hooks/useModal";

const ModalRenderer = () => {
  const { modals, closeModal } = useModal();
  
  return (
    <>
      {modals.map(modal => {
        const Component = modal.component;

        return (
            <Component
              key={modal.id}
              {...modal.data}
              onClose={() => closeModal(modal.id)}
            />
        )
      })}
    </>
  );
}

export default ModalRenderer;