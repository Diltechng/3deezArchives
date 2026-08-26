import { useModal } from "@/features/common/hooks/useModal"
import { EventFormModal } from "../components/EventFormModal";

export const useEventFormModal = () => {
  const { openFormModal } = useModal();

  const openAddEventModal = () => {
    openFormModal(EventFormModal, {
      title: "Add Event"
    });
  }

  const openEditEventModal = (initialData: any) => {
    openFormModal(EventFormModal, {
      title: "Edit Event",
      initialData,
    });
  }

  return {
    openAddEventModal,
    openEditEventModal,
  }
}