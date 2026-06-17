import type React from "react";

export type StatusVariant =
  | "success"
  | "danger"
  | "warning"
  | "primary"
  | "default";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  success: "bg-success-100 text-success-700 border-success-200",
  danger: "bg-danger-100 text-danger-700 border-danger-200",
  warning: "bg-warning-50 text-warning-700 border-warning-200",
  primary: "bg-primary-50 text-primary-700 border-primary-200",
  default: "bg-gray-100 text-gray-600 border-gray-200",
};

type Props = {
  label: string;
  variant?: StatusVariant;
  className?: string;
};

const StatusBadge: React.FC<Props> = ({
  label,
  variant = "default",
  className = "",
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${VARIANT_CLASSES[variant]} ${className}`}
  >
    {label}
  </span>
);

export default StatusBadge;
