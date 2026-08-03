import useModal from "@/features/common/hooks/useModal"
import PostForm from "../components/PostForm";

export const useEventFormModal = () => {
  const { openFormModal } = useModal();

  const openAddEventModal = () => {
    openFormModal(PostForm, {
      title: "Add Event"
    });
  }

  return {
    openAddEventModal,
  }
}