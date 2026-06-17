import { motion } from "motion/react";
import type React from "react";
import type { PropsWithChildren } from "react";

const PageSubHeader: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
      className="text-sm text-gray-500 mt-1"
    >
      {children}
    </motion.p>
  );
};

export default PageSubHeader;
