import { cn } from "../lib/utils";

interface BackdropProps {
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const Backdrop = ({ className, onClick }: BackdropProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "backdrop-blur-sm bg-black/20",
        className
      )}
    />
  )
}