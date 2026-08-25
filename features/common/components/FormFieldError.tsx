import { AlertTriangle } from "lucide-react";

const FormFieldError = ({ message }: {
  message?: string;
}) => (
  <div className="flex gap-1 items-center text-red-400">
    <AlertTriangle className="size-3.5" />
    <p className="text-[11px]">{message}</p>
  </div>
);

export { FormFieldError };