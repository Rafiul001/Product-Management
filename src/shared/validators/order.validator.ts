import { paymentMethods } from "@shared/constants/order/index.js";
import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const placeOrderFromCartValidationSchema = z.strictObject({
  paymentMethod: z.enum(paymentMethods),
  deliveryAddress: z.string().min(1).max(500).optional(),
});

export type TPlaceOrderFromCartValidationSchema = z.infer<
  typeof placeOrderFromCartValidationSchema
>;

export const placeOrderDirectValidationSchema = z.strictObject({
  productId: mongoId(),
  quantity: z.coerce.number().int().min(1),
  paymentMethod: z.enum(paymentMethods),
  deliveryAddress: z.string().min(1).max(500).optional(),
});

export type TPlaceOrderDirectValidationSchema = z.infer<
  typeof placeOrderDirectValidationSchema
>;

export const redirectToPaymentParamsValidationSchema = z.strictObject({
  checkoutId: z
    .string()
    .regex(/^CHK-[a-fA-F0-9]{24}-\d+(-D-[a-fA-F0-9]{24}-\d+)?$/),
});

export type TRedirectToPaymentParamsValidationSchema = z.infer<
  typeof redirectToPaymentParamsValidationSchema
>;

// Non-strict: SSLCommerz sends many extra fields in the callback body
export const confirmPaymentValidationSchema = z.object({
  status: z.string(),
  tran_id: z.string().min(1),
  val_id: z.string().optional(),
  bank_tran_id: z.string().optional(),
});

export type TConfirmPaymentValidationSchema = z.infer<
  typeof confirmPaymentValidationSchema
>;

export const refundOrderValidationSchema = z.strictObject({
  orderId: mongoId(),
  refund_amount: z.number().positive(),
  refund_remarks: z.string().min(1).max(200),
  bank_tran_id: z.string().min(1),
});

export type TRefundOrderValidationSchema = z.infer<
  typeof refundOrderValidationSchema
>;

export const cancelOrderParamsSchema = z.strictObject({
  id: mongoId(),
});

export type TCancelOrderParamsSchema = z.infer<typeof cancelOrderParamsSchema>;

export const updateOrderStatusAdminParamsSchema = z.strictObject({
  id: mongoId(),
});

export type TUpdateOrderStatusAdminParamsSchema = z.infer<
  typeof updateOrderStatusAdminParamsSchema
>;

export const updateOrderStatusAdminBodySchema = z.strictObject({
  orderStatus: z.enum([
    "PENDING",
    "CONFIRMED",
    "PACKAGING",
    "OUT_FOR_DELIVERY",
    "CANCELLED",
    "DELIVERED",
  ]),
});

export type TUpdateOrderStatusAdminBodySchema = z.infer<
  typeof updateOrderStatusAdminBodySchema
>;

export const cronSettingsBodySchema = z.strictObject({
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(0).max(23),
});

export type TCronSettingsBodySchema = z.infer<typeof cronSettingsBodySchema>;
