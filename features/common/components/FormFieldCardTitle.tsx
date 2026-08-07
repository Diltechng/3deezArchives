import { cn } from "../lib/utils";

const FormFieldCardTitle = ({ title, className }: {
  title?: string;
  className?: string;
}) => (
  <div className={cn(
    "pb-2.5 mb-4 tracking-[0.06em] uppercase text-[11px] border-b text-text-2 border-border",
    className
  )}>
    {title}
  </div>
)

export default FormFieldCardTitle;