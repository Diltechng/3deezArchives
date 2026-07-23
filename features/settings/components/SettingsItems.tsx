import { ChevronDown, ChevronRight } from "lucide-react"

type ChevronDirection = "right" | "down";

interface SettingsItemProps {
  label: string;
  value: string;
  chevron?: ChevronDirection;
  editable?: boolean;
  onEdit?: () => void;
};

const SettingsItem = ({ label, value, chevron="right", editable=true, onEdit }: SettingsItemProps) => {
  const chevronMap: Record<ChevronDirection, React.ComponentType<{ className: string }>> = {
    right: ChevronRight,
    down: ChevronDown,
  }

  const ChevronType = chevronMap[chevron];

  return (
    <div className="flex justify-between items-center py-5 px-2 text-sm font-sans border-b border-border-2">
      <div>
        {label}
      </div>
      {editable
        ? <button className="flex items-center gap-1 text-text-2" onClick={onEdit}>
          <span>{value}</span>
          <ChevronType className="w-4 h-4" />
        </button>
        : <span className="text-text-2">{value}</span>
      }
    </div>
  )
}

export default SettingsItem;