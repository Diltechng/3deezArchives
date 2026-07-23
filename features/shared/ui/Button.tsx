import { ClassValue } from "clsx";
import Link from "next/link";
import { cn } from "../lib/utils";

interface ButtonProps {
  href?: string;
  children?: React.ReactNode;
  Icon?: React.ComponentType<{ className: string }>;
  active?: boolean;
};

const Button = ({ href, active=false, Icon, children }: ButtonProps) => {
  return (
    <Link
      href={href ?? ""}
      className={cn(
        "flex items-center gap-2 py-2 px-2.5 w-full text-[13px] text-left font-sans rounded-lg duration-200",
        active? "bg-accent/10 text-accent": "text-text-2 hover:text-text hover:bg-surface-3",
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </Link>
  )
}

export default Button;