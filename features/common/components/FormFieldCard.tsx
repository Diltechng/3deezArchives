import { cn } from "../lib/utils";
import FormFieldCardTitle from "./FormFieldCardTitle";

const FormFieldCard = ({ children, className, title, columns }: {
  children?: React.ReactNode;
  className?: string;
  columns?: number;
  title?: string;
}) => (
  <div className={cn(
    "px-2 py-4 rounded-lg",
    className
  )}>
    <FormFieldCardTitle title={title} />

    <div className="grid gap-4" style={columns? {
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    }: undefined}>
      {children}
    </div>
  </div>
);

export { FormFieldCard };