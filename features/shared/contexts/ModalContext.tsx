import CreatePostForm from "@/features/posts/components/CreatePostForm";
import { createContext, useMemo, useState } from "react"

interface ValueTypes {
  modals: ModalType[];
  openFormModal: <T>(component: ModalType["component"], data: ModalData<T>) => void;
  closeModal: (modalId: string) => void;
}

export interface ModalType<T = unknown> {
  id: string;
  type: "form";
  component: React.ComponentType<any>;
  data: ModalData<T>;
}

type ModalData<T> = {
  title: string;
  subtitle?: string;
  initialData?: unknown;
} & T;

export const ModalContext = createContext<ValueTypes | null>(null);

const ModalProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [modals, setModals] = useState<ModalType[]>([]);
  
  function openFormModal<T>(component: ModalType["component"], data: ModalData<T>) {
    const id = crypto.randomUUID();
    setModals(prev => [...prev, {
      id,
      type: "form",
      component,
      data,
    }]);
  }

  function closeModal(modalId: string) {
    setModals(prev => prev.filter(modal => modal.id !== modalId));
  }

  const values = useMemo(() => ({
    modals,
    openFormModal,
    closeModal,
  }), [modals]);


  return (
    <ModalContext.Provider value={values}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider;