import { createContext, useMemo, useState } from "react"

interface ValueTypes<T = unknown> {
  showModal: boolean;
  modal: ModalType | undefined;
  modalData: (T & ModalDataType) | undefined;
  openModal: <T>(modal: ModalType, modalData: T & ModalDataType) => void;
  closeModal(): void;
}

interface ModalType {
  id: string;
  component: React.ReactNode;
  props: Record<string, any>;
}

interface ModalDataType {
  title?: string;
  subtitle?: string;
  initialData?: unknown;
}

const ModalContext = createContext<ValueTypes | null>(null);

const ModalProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState<ModalType | undefined>(undefined);
  const [modalData, setModalData] = useState<ModalDataType | undefined>(undefined);
  
  function openModal<T>(modal: ModalType, modalData: T & ModalDataType) {
    setModal(modal);
    setModalData(modalData);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModal(undefined);
    setModalData(undefined);
  }

  const values = useMemo(() => ({
    showModal,
    modal,
    modalData,
    openModal,
    closeModal,
  }), [showModal, modal, modalData]);


  return (
    <ModalContext.Provider value={values}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider;