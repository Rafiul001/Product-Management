import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import type React from "react";
import type { PropsWithChildren } from "react";

const DashboardContent: React.FC<
  PropsWithChildren & { colspan?: string; rowspan?: string }
> = ({ children, colspan, rowspan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        colspan ?? "",
        rowspan ?? "",
        "p-5",
        "flex flex-col justify-center items-center gap-4",
        "bg-white rounded-2xl border border-gray-100 shadow-sm",
        "hover:shadow-md transition-shadow duration-200",
        "text-center text-gray-900",
      )}
    >
      {children}
    </motion.div>
  );
};

export default DashboardContent;
