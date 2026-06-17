import useAdminAuthStore from "@/store/adminAuthStore";
import { cn } from "@/utils/cn";
import {
  Avatar,
  Button,
  ScrollShadow,
  Separator,
  Text,
  Tooltip,
} from "@heroui/react";
import type React from "react";
import { FaProductHunt, FaSitemap } from "react-icons/fa";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import {
  MdCategory,
  MdDashboard,
  MdImage,
  MdInventory2,
  MdLocalOffer,
  MdPeople,
  MdShoppingBag,
} from "react-icons/md";
import { NavLink } from "react-router";

interface SidebarProps {
  isCollapse: boolean;
  onToggle: () => void;
}

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: <MdDashboard size={20} /> },
  {
    path: "/admin/categories",
    label: "Categories",
    icon: <MdCategory size={20} />,
  },
  {
    path: "/admin/sub-categories",
    label: "Sub Categories",
    icon: <FaSitemap size={20} />,
  },
  {
    path: "/admin/products",
    label: "Products",
    icon: <FaProductHunt size={20} />,
  },
  {
    path: "/admin/stock-entries",
    label: "Stock Entries",
    icon: <MdInventory2 size={20} />,
  },
  {
    path: "/admin/banners",
    label: "Banners",
    icon: <MdImage size={20} />,
  },
  {
    path: "/admin/offers",
    label: "Offers",
    icon: <MdLocalOffer size={20} />,
  },
  {
    path: "/admin/orders",
    label: "Orders",
    icon: <MdShoppingBag size={20} />,
  },
  {
    path: "/admin/users",
    label: "Users",
    icon: <MdPeople size={20} />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapse, onToggle }) => {
  const { logout, admin } = useAdminAuthStore();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-100 shrink-0",
        "transition-all duration-300 ease-in-out",
        isCollapse ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between border-b border-gray-100 px-3 shrink-0">
        {isCollapse ? (
          <Button
            isIconOnly
            variant="primary"
            size="sm"
            onPress={onToggle}
            aria-label="Expand sidebar"
            className="mx-auto rounded-xl"
          >
            <FiMenu size={17} />
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <Text className="text-white font-bold text-xs">PM</Text>
              </div>
              <Text className="font-bold text-gray-900 text-sm truncate">
                Product Mgmt
              </Text>
            </div>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={onToggle}
              aria-label="Collapse sidebar"
              className="rounded-lg text-gray-400 hover:text-gray-700"
            >
              <FiX size={16} />
            </Button>
          </>
        )}
      </div>

      {/* Navigation */}
      <ScrollShadow className="flex-1 px-2 py-4">
        <nav>
          <ul className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                {isCollapse ? (
                  <Tooltip>
                    <Tooltip.Trigger>
                      <NavLink
                        to={item.path}
                        end={true}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-center rounded-xl transition-all duration-150 p-2.5",
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                          )
                        }
                      >
                        <span className="shrink-0">{item.icon}</span>
                      </NavLink>
                    </Tooltip.Trigger>
                    <Tooltip.Content placement="right">
                      {item.label}
                    </Tooltip.Content>
                  </Tooltip>
                ) : (
                  <NavLink
                    to={item.path}
                    end={true}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                      )
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <Text className="font-medium text-sm truncate">
                      {item.label}
                    </Text>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </ScrollShadow>

      {/* Bottom: User profile + Logout */}
      <div className="shrink-0 px-3 pb-3">
        <Separator className="mb-3" />
        {!isCollapse && (
          <div className="flex items-center gap-3 px-1 py-2 mb-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Avatar size="sm" className="bg-primary-100 shrink-0">
              <Avatar.Fallback className="text-primary-700 text-xs font-bold">
                {admin?.adminUserName?.charAt(0).toUpperCase() ?? "A"}
              </Avatar.Fallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Text className="text-sm font-semibold text-gray-900 truncate leading-tight block">
                {admin?.adminUserName}
              </Text>
              <Text className="text-xs text-gray-500 truncate leading-tight capitalize block">
                {admin?.adminType}
              </Text>
            </div>
          </div>
        )}
        <Button
          onPress={async () => {
            await logout();
          }}
          variant="danger-soft"
          size="sm"
          fullWidth={!isCollapse}
          isIconOnly={isCollapse}
          aria-label="Logout"
        >
          {isCollapse ? (
            <FiLogOut size={18} />
          ) : (
            <>
              <FiLogOut size={15} className="mr-1" /> Logout
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
