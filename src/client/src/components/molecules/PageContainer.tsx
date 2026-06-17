import type React from "react";
import type { PropsWithChildren } from "react";

const PageContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="w-full p-6 max-w-7xl mx-auto">{children}</div>;
};

export default PageContainer;
