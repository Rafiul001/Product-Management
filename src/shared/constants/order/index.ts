export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PACKAGING: "PACKAGING",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
} as const;

export type TOrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export const orderStatuses = Object.values(ORDER_STATUS);

export const ORDER_STATUS_TRANSITIONS: Record<TOrderStatus, TOrderStatus[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PACKAGING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PACKAGING]: [ORDER_STATUS.OUT_FOR_DELIVERY],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

export const PAYMENT_STATUS = {
  PAID: "PAID",
  DUE: "DUE",
  REFUNDED: "REFUNDED",
} as const;

export type TPaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export const paymentStatuses = Object.values(PAYMENT_STATUS);

export const PAYMENT_METHOD = {
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  ONLINE_MOBILE_BANKING: "ONLINE_MOBILE_BANKING",
  VISA_OR_MASTER_CARD: "VISA_OR_MASTER_CARD",
} as const;

export type TPaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export const paymentMethods = Object.values(PAYMENT_METHOD);

export const REFUND_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as const;

export type TRefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];
export const refundStatuses = Object.values(REFUND_STATUS);
