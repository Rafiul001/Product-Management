import ProductImage from "@/components/molecules/ProductImage";
import type { StatusVariant } from "@/components/molecules/StatusBadge";
import StatusBadge from "@/components/molecules/StatusBadge";
import {
  useUserDashboardStore,
  type TMyOrder,
} from "@/store/userDashboardStore";
import { Spinner } from "@heroui/react";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "@shared/constants/order/index";
import type React from "react";
import { useState } from "react";

const ORDER_STATUS_VARIANT: Record<string, StatusVariant> = {
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.CONFIRMED]: "primary",
  [ORDER_STATUS.PACKAGING]: "primary",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "primary",
  [ORDER_STATUS.DELIVERED]: "success",
  [ORDER_STATUS.CANCELLED]: "danger",
};

const PAYMENT_STATUS_VARIANT: Record<string, StatusVariant> = {
  [PAYMENT_STATUS.DUE]: "warning",
  [PAYMENT_STATUS.PAID]: "success",
  [PAYMENT_STATUS.REFUNDED]: "default",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  [PAYMENT_METHOD.CASH_ON_DELIVERY]: "Cash on Delivery",
  [PAYMENT_METHOD.ONLINE_MOBILE_BANKING]: "Online / Mobile Banking",
  [PAYMENT_METHOD.VISA_OR_MASTER_CARD]: "Visa / Mastercard",
};

const OrderCard: React.FC<{ order: TMyOrder }> = ({ order }) => {
  const { cancelOrder } = useUserDashboardStore();
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    await cancelOrder(order._id);
    setCancelling(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-400">Order ID</p>
          <p className="text-xs font-mono text-gray-700 break-all">
            {order._id}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge
            label={order.orderStatus}
            variant={ORDER_STATUS_VARIANT[order.orderStatus] ?? "default"}
          />
          <StatusBadge
            label={order.paymentStatus}
            variant={PAYMENT_STATUS_VARIANT[order.paymentStatus] ?? "default"}
          />
          {order.orderStatus === ORDER_STATUS.CONFIRMED && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-danger-600 border border-danger-200 rounded-full hover:bg-danger-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelling ? <Spinner size="sm" /> : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {order.cancellationNote && (
        <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
          <span className="text-amber-500 mt-0.5 shrink-0 text-xs">
            &#9432;
          </span>
          <p className="text-xs text-amber-700">{order.cancellationNote}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-400">Date</p>
          <p className="text-gray-700">
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-400">Payment</p>
          <p className="text-gray-700">
            {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
          </p>
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <p className="text-xs text-gray-400">Total</p>
          <p className="font-bold text-gray-900">
            ৳{order.totalPrice.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          {expanded
            ? "Hide items"
            : `View ${order.productList.length} item${order.productList.length !== 1 ? "s" : ""}`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 px-5 py-3 flex flex-col gap-3">
          {order.productList.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                <ProductImage
                  src={item.product.productImage}
                  alt={item.product.productName}
                  imgClassName="w-full h-full object-contain p-1"
                  placeholderClassName="w-6 h-6 text-gray-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.product.productName}
                </p>
                <p className="text-xs text-gray-500">
                  ৳{item.unitPrice.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-900 shrink-0">
                ৳{(item.unitPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
