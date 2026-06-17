import AdminPageHeader from "@/components/molecules/AdminPageHeader";
import PageContainer from "@/components/molecules/PageContainer";
import type { StatusVariant } from "@/components/molecules/StatusBadge";
import StatusBadge from "@/components/molecules/StatusBadge";
import type { TAdminOrder } from "@/store/adminOrderStore";
import { useAdminOrderStore } from "@/store/adminOrderStore";
import { Button, ListBox, ListBoxItem, Select, Text } from "@heroui/react";
import type { TOrderStatus } from "@shared/constants/order/index";
import {
  ORDER_STATUS,
  ORDER_STATUS_TRANSITIONS,
} from "@shared/constants/order/index";
import type React from "react";
import { useEffect, useState } from "react";

const orderStatusVariant: Record<TOrderStatus, StatusVariant> = {
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.CONFIRMED]: "primary",
  [ORDER_STATUS.PACKAGING]: "primary",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "primary",
  [ORDER_STATUS.DELIVERED]: "success",
  [ORDER_STATUS.CANCELLED]: "danger",
};

const paymentStatusVariant: Record<string, StatusVariant> = {
  PAID: "success",
  DUE: "warning",
  REFUNDED: "default",
};

const OrderRow: React.FC<{
  order: TAdminOrder;
  onStatusChange: (id: string, status: TOrderStatus) => void;
}> = ({ order, onStatusChange }) => {
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const validNextStatuses = ORDER_STATUS_TRANSITIONS[order.orderStatus] ?? [];
  const isTerminal = validNextStatuses.length === 0;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-xs text-gray-500 font-mono">
        {order._id.slice(-8).toUpperCase()}
      </td>
      <td className="px-4 py-3">
        <div>
          <Text className="text-sm font-medium text-gray-900 block">
            {order.user?.userName ?? "—"}
          </Text>
          <Text className="text-xs text-gray-400 block">
            {order.user?.userEmail ?? ""}
          </Text>
          <Text className="text-xs text-gray-500 block">
            {order.user?.userPhoneNumber ?? ""}
          </Text>
          {order.user?.address && (
            <Text className="text-xs text-gray-400 italic block max-w-40 truncate">
              {order.user.address}
            </Text>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          {order.productList.map((item) => (
            <Text key={item._id} className="text-xs text-gray-700 block">
              {item.product?.productName ?? "—"} × {item.quantity}
            </Text>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        ৳{order.totalPrice.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <StatusBadge
          label={order.paymentStatus}
          variant={paymentStatusVariant[order.paymentStatus] ?? "default"}
        />
      </td>
      <td className="px-4 py-3">
        {isTerminal ? (
          <StatusBadge
            label={order.orderStatus}
            variant={orderStatusVariant[order.orderStatus]}
          />
        ) : (
          <Select
            value={order.orderStatus}
            onChange={(val) => {
              if (val && val !== order.orderStatus)
                onStatusChange(order._id, val as TOrderStatus);
            }}
            className="min-w-40"
            aria-label="Order status"
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBoxItem
                  key={order.orderStatus}
                  id={order.orderStatus}
                  isDisabled
                >
                  <StatusBadge
                    label={order.orderStatus}
                    variant={orderStatusVariant[order.orderStatus]}
                    className="opacity-50"
                  />
                </ListBoxItem>
                {validNextStatuses.map((s) => (
                  <ListBoxItem key={s} id={s}>
                    <StatusBadge label={s} variant={orderStatusVariant[s]} />
                  </ListBoxItem>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400">{date}</td>
    </tr>
  );
};

const CronSettingsPanel: React.FC = () => {
  const {
    cronSettings,
    cronSettingsLoading,
    fetchCronSettings,
    saveCronSettings,
  } = useAdminOrderStore();
  const [localStartHour, setLocalStartHour] = useState<number | null>(null);
  const [localEndHour, setLocalEndHour] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCronSettings();
  }, [fetchCronSettings]);

  const startHour = localStartHour ?? cronSettings?.startHour ?? 9;
  const endHour = localEndHour ?? cronSettings?.endHour ?? 17;

  const handleSave = async () => {
    setSaving(true);
    await saveCronSettings(startHour, endHour);
    setLocalStartHour(null);
    setLocalEndHour(null);
    setSaving(false);
  };

  const formatHour = (h: number) => {
    const period = h < 12 ? "AM" : "PM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:00 ${period}`;
  };

  return (
    <div className="mb-6 p-4 rounded-xl border border-blue-100 bg-blue-50">
      <p className="text-sm font-semibold text-blue-800 mb-3">
        Refund Cron Window
      </p>
      <p className="text-xs text-blue-600 mb-4">
        SSL Commerz refunds for cancelled orders are automatically processed
        once per hour within this window.
      </p>
      {cronSettingsLoading ? (
        <Text className="text-xs text-blue-500">Loading...</Text>
      ) : (
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-blue-700">
              Start Hour
            </label>
            <select
              value={startHour}
              onChange={(e) => setLocalStartHour(Number(e.target.value))}
              className="text-sm border border-blue-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {formatHour(i)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-blue-700">
              End Hour
            </label>
            <select
              value={endHour}
              onChange={(e) => setLocalEndHour(Number(e.target.value))}
              className="text-sm border border-blue-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {formatHour(i)}
                </option>
              ))}
            </select>
          </div>
          <Button
            size="sm"
            variant="primary"
            onPress={handleSave}
            isDisabled={saving || startHour >= endHour}
            className="rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          {startHour >= endHour && (
            <p className="text-xs text-danger-600">
              Start hour must be before end hour.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Orders: React.FC = () => {
  const { orders, ordersLoading, updateOrderStatus } = useAdminOrderStore();

  return (
    <PageContainer>
      <AdminPageHeader title="Orders" subtitle="Manage customer orders" />

      <CronSettingsPanel />

      {ordersLoading ? (
        <Text className="text-center mt-30 block text-gray-400">
          Loading orders...
        </Text>
      ) : orders.length === 0 ? (
        <Text className="text-center mt-30 block text-gray-400">
          No orders placed yet
        </Text>
      ) : (
        <div className="mt-2 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={updateOrderStatus}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
};

export default Orders;
