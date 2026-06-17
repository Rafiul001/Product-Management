import EmptyState from "@/components/molecules/EmptyState";
import { useUserDashboardStore } from "@/store/userDashboardStore";
import { Spinner } from "@heroui/react";
import type React from "react";
import { useEffect } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import OrderCard from "./OrderCard";

const OrdersTab: React.FC = () => {
  const { orders, ordersLoading, fetchMyOrders } = useUserDashboardStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (ordersLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<HiOutlineClipboardList className="w-8 h-8 text-gray-400" />}
        title="No orders yet"
        description="Your placed orders will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
};

export default OrdersTab;
