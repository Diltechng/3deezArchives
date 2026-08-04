import useModal from "@/features/common/hooks/useModal"
import { PostFormModal } from "../components/PostFormModal";

export const useEventFormModal = () => {
  const { openFormModal } = useModal();

  const openAddEventModal = () => {
    openFormModal(PostFormModal, {
      title: "Add Event"
    });
  }

  return {
    openAddEventModal,
  }
}