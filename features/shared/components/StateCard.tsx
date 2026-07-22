import { ClassValue } from "clsx";
import { cn } from "../lib/utils";

interface StateCardProps {
  icon: {
    component: React.ComponentType<any>;
    color?: "accent" | "accent-2" | "accent-3";
  }
  title: string;
  subtitle: string;
  className?: ClassValue;
}

const StateCard = ({ icon, title, subtitle, className }: StateCardProps) => (
  <div className={
    cn(
      "my-auto mx-auto py-8 px-12 min-h-50 h-full max-h-70 min-w-50 w-full max-w-130 flex flex-col gap-4 justify-center items-center rounded-lg text-center border border-border-2 bg-surface",
      className
    )
  }>
    <div className={cn("p-3 h-13 aspect-square rounded-full bg-current/10", `text-${icon.color ?? "accent-2"}`)}>
      <icon.component className="h-full w-full" />
    </div>
    <div className="font-sans font-bold">
      {title}
    </div>
    <div className="text-[10px] uppercase text-text-3">
      {subtitle}
    </div>
  </div>
);

export default StateCard;