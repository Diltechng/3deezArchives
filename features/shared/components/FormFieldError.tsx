const FormFieldError = ({ message }: {
  message?: string;
}) => (
  <p className="ml-2 text-[11px] text-red-400">{"* " + message}</p>
);

export default FormFieldError;