import { createContext, useMemo, useState } from "react"
import { FormModalVariant } from "../types/FormModal.types";
import { ConfirmationModal } from "../components/ConfirmationModal";

interface ValueTypes {
  modals: ModalType[];
  openFormModal: <T>(component: ModalComponent<any>, data: FormModalData<T>) => void;
  confirm: (data: ConfirmModalData) => Promise<boolean>;
  closeModal: (modalId: string) => void;
}

export interface ModalType<T = any> {
  id: string;
  component: ModalComponent<any>;
  data: T;
}

export type ModalComponent<T = unknown> = React.ComponentType<T>;

export type FormModalData<T = unknown> = {
  title: string;
  subtitle?: string;
  initialData?: T;
  variant?: FormModalVariant;
};

export type ConfirmModalData = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

export const ModalContext = createContext<ValueTypes | null>(null);

const ModalProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  const [modals, setModals] = useState<ModalType[]>([]);
  
  function openModal<T>(
    component: ModalComponent<any>,
    data: T
  ) {
    const id = crypto.randomUUID();
    setModals(prev => [...prev, {
      id,
      component,
      data,
    }]);
  }

  function openFormModal<T>(
    component: ModalComponent<FormModalData<T>>,
    data: FormModalData<T>,
  ) {
    openModal(
      component,
      data
    );
  }

  function confirm(data: ConfirmModalData) {
    return new Promise<boolean>((resolve) => {
      openModal(
        ConfirmationModal,
        {
          ...data,
          resolve,
        }
      );
    });
  }

  function closeModal(modalId: string) {
    setModals(
      prev =>
        prev.filter(modal => modal.id !== modalId)
    );
  }

  const value = useMemo(() => ({
    modals,
    confirm,
    openFormModal,
    closeModal,
  }), [modals]);


  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider;