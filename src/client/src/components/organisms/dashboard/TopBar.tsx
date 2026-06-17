import useAdminAuthStore from "@/store/adminAuthStore";
import { Avatar, Button, Separator, Text } from "@heroui/react";
import type React from "react";
import { BsBell } from "react-icons/bs";
import { useLocation } from "react-router";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/categories": "Categories",
  "/admin/sub-categories": "Sub Categories",
  "/admin/products": "Products",
  "/admin/stock-entries": "Stock Entries",
};

const TopBar: React.FC = () => {
  const { admin } = useAdminAuthStore();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <Text className="text-base font-semibold text-gray-800">{pageTitle}</Text>

      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          aria-label="Notifications"
          className="rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500"
        >
          <BsBell size={17} />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2.5">
          <Avatar size="sm" className="bg-primary-100 shrink-0">
            <Avatar.Fallback className="text-primary-700 font-bold text-xs">
              {admin?.adminUserName?.charAt(0).toUpperCase() ?? "A"}
            </Avatar.Fallback>
          </Avatar>
          <div className="hidden sm:block">
            <Text className="text-sm font-semibold text-gray-900 leading-tight block">
              {admin?.adminUserName}
            </Text>
            <Text className="text-xs text-gray-500 leading-tight capitalize block">
              {admin?.adminType}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
