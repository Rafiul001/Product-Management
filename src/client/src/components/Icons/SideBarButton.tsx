import { cn } from "@/utils/cn";
import type React from "react";

const SideBarButton: React.FC<{ rotate?: boolean }> = ({ rotate }) => {
  return (
    <svg
      className={cn(
        "w-full h-full fill-current",
        rotate ? "rotate-180" : "rotate-0",
      )}
      viewBox="0 0 74 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M74 70L0 140L0 0L74 70Z" />
    </svg>
  );
};

export default SideBarButton;
