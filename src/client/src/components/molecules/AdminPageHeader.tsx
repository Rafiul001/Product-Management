import PageHeader from "@/components/molecules/PageHeader";
import PageSubHeader from "@/components/molecules/PageSubHeader";
import { Button } from "@heroui/react";
import type React from "react";

type Props = {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
};

const AdminPageHeader: React.FC<Props> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
}) => (
  <div className="flex justify-between items-end">
    <div>
      <PageHeader>{title}</PageHeader>
      <PageSubHeader>{subtitle}</PageSubHeader>
    </div>
    {actionLabel && onAction && (
      <Button variant="primary" onPress={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default AdminPageHeader;
