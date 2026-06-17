import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import type React from "react";
import type { ReactNode } from "react";

interface IStatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  delay?: number;
}

const StatCard: React.FC<IStatCardProps> = ({
  label,
  value,
  icon,
  iconBg = "bg-primary-50",
  iconColor = "text-primary-600",
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm p-5",
        "hover:shadow-md transition-shadow duration-200",
        "flex items-center justify-between gap-4",
      )}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          iconBg,
        )}
      >
        <span className={cn("text-2xl", iconColor)}>{icon}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
