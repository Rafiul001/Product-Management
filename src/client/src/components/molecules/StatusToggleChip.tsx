import type React from "react";

type Props = {
  isActive: boolean;
  onToggle: () => void | Promise<void>;
};

const StatusToggleChip: React.FC<Props> = ({ isActive, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`px-3 py-1 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
      isActive
        ? "bg-success-100 text-success-700 hover:bg-success-200"
        : "bg-danger-100 text-danger-700 hover:bg-danger-200"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </button>
);

export default StatusToggleChip;
