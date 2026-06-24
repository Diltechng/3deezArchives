import clsx from "clsx";

export const FilterChipSkeleton = () => (
  <div
    className="h-6.5 w-12 rounded-full border text-[10px] animate-shimmer border-border-2/40 bg-shimmer"
  />
)

const FilterChip = ({ name, active=false, className, onClick }: {
  name: string;
  active?: boolean;
  className?: string;
  onClick?: () => unknown;
}) => (
  <button
    className={clsx(
      "px-2.5 py-1 rounded-full border text-[10px]",
      active? "text-accent bg-accent/10": "text-text-2 border-border-2 hover:text-text",
      className
    )}
    onClick={onClick}
  >
    {name}
  </button>
);

export default FilterChip;