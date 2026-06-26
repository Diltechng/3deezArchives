import { cn } from "../lib/utils";
import FormFieldCardTitle from "./FormFieldCardTitle";

const FormFieldCard = ({ children, className, title, columns=1 }: {
  children?: React.ReactNode;
  className?: string;
  columns?: number;
  title?: string;
}) => (
  <div className={cn(
    "p-5 rounded-lg bg-surface mb-4",
    className
  )}>
    <FormFieldCardTitle title={title} />

    <div className="grid gap-4" style={{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    }}>
      {children}
    </div>
  </div>
);

export default FormFieldCard;