import sslcz from "@server/services/ssl/sslczClient.js";
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  REFUND_STATUS,
} from "@shared/constants/order/index.js";
import { CronSettingsModel } from "@shared/models/CronSettings.js";
import { OrderModel } from "@shared/models/Order.js";
import cron from "node-cron";

const getSslCredentials = () => {
  const storeId = process.env.SSL_STORE_ID;
  const storePassword = process.env.SSL_STORE_PASSWORD;
  if (!storeId || !storePassword) return null;
  return { storeId, storePassword };
};

const processRefunds = async () => {
  const settings = await CronSettingsModel.findOne().lean();
  const startHour = settings?.startHour ?? 9;
  const endHour = settings?.endHour ?? 17;

  const currentHour = new Date().getHours();
  if (currentHour < startHour || currentHour >= endHour) return;

  const ssl = getSslCredentials();
  if (!ssl) {
    console.warn("[RefundCron] SSL credentials not set, skipping refunds.");
    return;
  }

  const pendingOrders = await OrderModel.find({
    orderStatus: ORDER_STATUS.CANCELLED,
    paymentMethod: PAYMENT_METHOD.ONLINE_MOBILE_BANKING,
    paymentStatus: PAYMENT_STATUS.PAID,
    "refundStatus.status": REFUND_STATUS.PENDING,
    bankTransactionId: { $exists: true, $nin: [null, ""] },
  });

  if (pendingOrders.length === 0) return;

  console.log(`[RefundCron] Processing ${pendingOrders.length} refund(s)...`);

  for (const order of pendingOrders) {
    try {
      const refundRefId = `REF-${order._id.toString()}-${Date.now()}`;

      const refundResponse = (await sslcz.initiateRefund({
        refund_amount: order.totalPrice,
        refund_remarks: "Order cancellation refund",
        bank_tran_id: order.bankTransactionId!,
        refe_id: refundRefId,
      })) as {
        status?: string;
        APIConnect?: string;
        refund_ref_id?: string;
      };

      const succeeded =
        refundResponse?.status?.toLowerCase() === "success" ||
        refundResponse?.APIConnect === "DONE";

      await OrderModel.findByIdAndUpdate(order._id, {
        $set: {
          paymentStatus: succeeded
            ? PAYMENT_STATUS.REFUNDED
            : PAYMENT_STATUS.PAID,
          "refundStatus.refundId": refundResponse?.refund_ref_id ?? refundRefId,
          "refundStatus.amount": order.totalPrice,
          "refundStatus.reason": "Order cancellation refund",
          "refundStatus.status": succeeded
            ? REFUND_STATUS.SUCCESS
            : REFUND_STATUS.FAILED,
        },
      });

      console.log(
        `[RefundCron] Order ${order._id}: refund ${succeeded ? "succeeded" : "failed"}.`,
      );
    } catch (err) {
      console.error(`[RefundCron] Error refunding order ${order._id}:`, err);
    }
  }
};

export const startRefundCron = () => {
  // Run at the start of every hour
  cron.schedule("0 * * * *", () => {
    processRefunds().catch((err) =>
      console.error("[RefundCron] Unexpected error:", err),
    );
  });

  console.log("[RefundCron] Refund cron job started (runs every hour).");
};
