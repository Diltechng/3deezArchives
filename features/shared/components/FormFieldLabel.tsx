import { cn } from "../lib/utils";

const FormFieldLabel = ({ label, htmlFor, className, children }: {
  htmlFor?: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={cn(
    "text-[10px] tracking-[0.08rem] uppercase text-text-3",
    className
  )}>
    {children ?? label}
  </label>
);

export default FormFieldLabel;