import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { cn } from "../lib/utils";
import FormFieldError from "./FormFieldError";
import FormFieldLabel from "./FormFieldLabel";

const FormField = ({ children, htmlFor, label, error, className }: {
  children?: React.ReactNode;
  htmlFor?: string;
  label?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<{}>>;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label && <FormFieldLabel label={label} />}
    {children}
    {error && <FormFieldError message={error.message} />}
  </div>
)

export default FormField