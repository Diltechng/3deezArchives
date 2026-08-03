import useModal from "../hooks/useModal";
import BackgroundOverlay from "./BackgroundOverlay";

const ModalRenderer = () => {
  const { modals, closeModal } = useModal();
  
  return (
    <>
      {modals.map(modal => {
        const Component = modal.component;

        return (
          <BackgroundOverlay key={modal.id} className="z-90">
            <Component
              {...modal.data}
              onClose={() => closeModal(modal.id)}
            />
          </BackgroundOverlay>
        )
      })}
    </>
  );
}

export default ModalRenderer;