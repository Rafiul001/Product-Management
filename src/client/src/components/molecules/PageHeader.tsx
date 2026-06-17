import { cn } from "@/utils/cn";
import { motion } from "motion/react";
import type React from "react";
import type { PropsWithChildren } from "react";

const PageHeader: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.h1
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("text-2xl font-bold text-gray-900")}
    >
      {children}
    </motion.h1>
  );
};

export default PageHeader;
