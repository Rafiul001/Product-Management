import type React from "react";

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

const EmptyState: React.FC<Props> = ({
  icon,
  title,
  description,
  action,
  className = "py-20",
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}
  >
    {icon && (
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        {icon}
      </div>
    )}
    <div>
      <p className="font-semibold text-gray-700">{title}</p>
      {description && (
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      )}
    </div>
    {action}
  </div>
);

export default EmptyState;
