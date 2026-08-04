import BackgroundOverlay from "./BackgroundOverlay"

interface ConfirmModalProps {
  title: string;
  message: string;
}

export const ConfirmModal = ({}: ConfirmModalProps) => {
  return (
    <>
      <BackgroundOverlay className="z-90"/>
    </>
  )
} 