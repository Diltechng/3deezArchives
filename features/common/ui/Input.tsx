import { cn } from "../lib/utils";

interface InputProps {
  id?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Input = ({ id, type, placeholder, className, value, onChange, onKeyDown, ...props }: InputProps) => {
  return (
    <input
      id={id}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={cn(
        "px-3 py-2.25 text-sm rounded-lg duration-200 border border-border bg-surface focus:border-accent-primary",
        className,
      )}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  )
}