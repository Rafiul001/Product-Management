import type { ValidatedRequest } from "@server/middleware/validator.js";
import sslcz from "@server/services/ssl/sslczClient.js";
import config from "@shared/config/config.js";
import {
  ORDER_STATUS,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  paymentMethods,
  REFUND_STATUS,
} from "@shared/constants/order/index.js";
import { Cart } from "@shared/models/Cart.js";
import { CronSettingsModel } from "@shared/models/CronSettings.js";
import { OfferModel } from "@shared/models/Offer.js";
import { OrderModel } from "@shared/models/Order.js";
import { ProductModel } from "@shared/models/Product.js";
import { UserModel } from "@shared/models/User.js";
import { badRequest, notFound, ok } from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import { getBestOfferedPrice } from "@shared/utils/offerPrice.js";
import type {
  TCancelOrderParamsSchema,
  TConfirmPaymentValidationSchema,
  TPlaceOrderDirectValidationSchema,
  TPlaceOrderFromCartValidationSchema,
  TRedirectToPaymentParamsValidationSchema,
  TRefundOrderValidationSchema,
  TUpdateOrderStatusAdminBodySchema,
  TUpdateOrderStatusAdminParamsSchema,
} from "@shared/validators/order.validator.js";
import { Types } from "mongoose";

const getSslCredentials = () => {
  const {
    SSL_STORE_ID: storeId,
    SSL_STORE_PASSWORD: storePassword,
    SSL_IS_LIVE: isLive,
  } = config;

  if (!storeId || !storePassword) return null;

  return { storeId, storePassword, isLive };
};

const extractCheckoutIdFromTranId = (tranId: string) => {
  if (!tranId.startsWith("PAY-")) return null;
  return tranId.slice(4);
};

const extractUserIdFromCheckoutId = (checkoutId: string) => {
  const [prefix, userId] = checkoutId.split("-");
  if (prefix !== "CHK" || !userId) return null;
  return userId;
};

const extractDirectBuyFromCheckoutId = (
  checkoutId: string,
): { productId: string; quantity: number } | null => {
  const match = checkoutId.match(/-D-([a-fA-F0-9]{24})-(\d+)$/);
  if (!match) return null;
  return { productId: match[1]!, quantity: parseInt(match[2]!, 10) };
};

const resolveUnitPrice = async (
  productId: string | Types.ObjectId,
  price: number,
) => {
  const now = new Date();
  const activeOffers = await OfferModel.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
  const offeredPrice = getBestOfferedPrice(
    price,
    productId as Types.ObjectId,
    activeOffers,
  );
  return offeredPrice ?? price;
};

const formatHour = (hour: number) => {
  const period = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${period}`;
};

const buildCancellationNote = async () => {
  const settings = await CronSettingsModel.findOne().lean();
  const startHour = settings?.startHour ?? 9;
  const endHour = settings?.endHour ?? 17;
  return `Your refund will be processed between ${formatHour(startHour)} and ${formatHour(endHour)}.`;
};

export const placeOrderFromCartController = asyncController<
  ValidatedRequest<{ body: TPlaceOrderFromCartValidationSchema }>
>(async (req, res) => {
  const userId = req.userId!;
  const { paymentMethod, deliveryAddress } = req.validatedBody;

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) return badRequest(res, "Cart is empty");

  if (paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY) {
    const newOrder = new OrderModel({
      user: userId,
      productList: cart.items,
      totalPrice: cart.totalPrice,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.CONFIRMED,
      ...(deliveryAddress && { deliveryAddress }),
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user: userId });

    return ok(res, "Order accepted", {
      orderId: newOrder._id,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.CONFIRMED,
    });
  }

  if (paymentMethod !== PAYMENT_METHOD.ONLINE_MOBILE_BANKING)
    return badRequest(res, "Unsupported payment method");

  const checkoutId = `CHK-${userId}-${Date.now()}`;
  const redirectPath = `/api/v1/order/redirect-to-payment/${checkoutId}`;

  return res.redirect(303, redirectPath);
});

export const placeOrderDirectController = asyncController<
  ValidatedRequest<{ body: TPlaceOrderDirectValidationSchema }>
>(async (req, res) => {
  const userId = req.userId!;
  const { productId, quantity, paymentMethod, deliveryAddress } =
    req.validatedBody;

  const productDoc =
    await ProductModel.findById(productId).select("price quantity");
  if (!productDoc) return notFound(res, "Product not found");
  if (productDoc.quantity < quantity)
    return badRequest(
      res,
      `Only ${productDoc.quantity} unit(s) available in stock`,
    );

  const unitPrice = await resolveUnitPrice(productDoc._id, productDoc.price);
  const totalPrice = unitPrice * quantity;

  if (paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY) {
    const newOrder = new OrderModel({
      user: userId,
      productList: [{ product: productId, unitPrice, quantity }],
      totalPrice,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.CONFIRMED,
      ...(deliveryAddress && { deliveryAddress }),
    });
    await newOrder.save();
    return ok(res, "Order accepted", {
      orderId: newOrder._id,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.CONFIRMED,
    });
  }

  if (paymentMethod !== PAYMENT_METHOD.ONLINE_MOBILE_BANKING)
    return badRequest(res, "Unsupported payment method");

  const checkoutId = `CHK-${userId}-${Date.now()}-D-${productId}-${quantity}`;
  return res.redirect(303, `/api/v1/order/redirect-to-payment/${checkoutId}`);
});

export const redirectToPaymentController = asyncController<
  ValidatedRequest<{ params: TRedirectToPaymentParamsValidationSchema }>
>(async (req, res) => {
  const userId = req.userId!;
  const { checkoutId } = req.params;

  const checkoutUserId = extractUserIdFromCheckoutId(checkoutId);
  if (!checkoutUserId || checkoutUserId !== userId)
    return badRequest(res, "Invalid checkout id");

  const directBuy = extractDirectBuyFromCheckoutId(checkoutId);

  let totalAmount: number;
  if (directBuy) {
    const productDoc = await ProductModel.findById(directBuy.productId).select(
      "price quantity",
    );
    if (!productDoc) return notFound(res, "Product not found");
    if (productDoc.quantity < directBuy.quantity)
      return badRequest(
        res,
        `Only ${productDoc.quantity} unit(s) available in stock`,
      );
    const unitPrice = await resolveUnitPrice(productDoc._id, productDoc.price);
    totalAmount = unitPrice * directBuy.quantity;
  } else {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0)
      return badRequest(res, "Cart is empty");
    totalAmount = cart.totalPrice;
  }

  const user = await UserModel.findById(userId);
  if (!user) return notFound(res, "User not found");

  const ssl = getSslCredentials();
  if (!ssl)
    return badRequest(
      res,
      "SSL credentials are missing. Set SSL_STORE_ID and SSL_STORE_PASSWORD",
    );

  const transactionId = `PAY-${checkoutId}`;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const paymentPayload = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${baseUrl}/api/v1/order/confirm-payment`,
    fail_url: `${baseUrl}/api/v1/order/confirm-payment`,
    cancel_url: `${baseUrl}/api/v1/order/confirm-payment`,
    ipn_url: `${baseUrl}/api/v1/order/confirm-payment`,
    shipping_method: "NO",
    product_name: "",
    product_category: "",
    product_profile: "",
    cus_name: user.userName,
    cus_email: user.userEmail,
    cus_add1: user.address,
    cus_add2: user.address,
    cus_city: "",
    cus_state: "",
    cus_postcode: "",
    cus_country: "Bangladesh",
    cus_phone: user.userPhoneNumber,
    cus_fax: user.userPhoneNumber,
    ship_name: user.userName,
    ship_add1: user.address,
    ship_add2: user.address,
    ship_city: "",
    ship_state: "",
    ship_postcode: "",
    ship_country: "Bangladesh",
    value_a: PAYMENT_METHOD.ONLINE_MOBILE_BANKING,
    value_b: userId,
  };

  const paymentResponse = (await sslcz.init(paymentPayload)) as {
    GatewayPageURL?: string;
  };

  if (!paymentResponse?.GatewayPageURL)
    return badRequest(res, "Unable to initialize SSL payment");

  return res.redirect(paymentResponse.GatewayPageURL);
});

export const confirmPaymentController = asyncController<
  ValidatedRequest<{ body: TConfirmPaymentValidationSchema }>
>(async (req, res) => {
  const { status, tran_id, val_id, bank_tran_id } = req.validatedBody;
  const checkoutId = extractCheckoutIdFromTranId(tran_id);

  if (!checkoutId) return badRequest(res, "Invalid transaction id");

  const userId = extractUserIdFromCheckoutId(checkoutId);
  if (!userId) return badRequest(res, "Invalid checkout id");

  let isPaid = ["VALID", "VALIDATED", "SUCCESS"].includes(status.toUpperCase());

  const ssl = getSslCredentials();
  if (isPaid && val_id && ssl) {
    const validationResponse = (await sslcz.validate({ val_id })) as {
      status?: string;
    };

    isPaid = ["VALID", "VALIDATED", "SUCCESS"].includes(
      String(validationResponse?.status ?? "").toUpperCase(),
    );
  }

  if (!isPaid) {
    const clientUrl = config.CLIENT_URL;
    return res.redirect(`${clientUrl}/payment-failed`);
  }

  const reqBody = req.body as Record<string, unknown>;
  const paymentMethodFromGateway = String(reqBody.value_a ?? "");
  const paymentMethod = paymentMethods.some(
    (method) => method === paymentMethodFromGateway,
  )
    ? (paymentMethodFromGateway as (typeof paymentMethods)[number])
    : PAYMENT_METHOD.ONLINE_MOBILE_BANKING;

  const resolvedBankTranId = bank_tran_id ?? String(reqBody.bank_tran_id ?? "");

  const directBuy = extractDirectBuyFromCheckoutId(checkoutId);

  if (directBuy) {
    const productDoc = await ProductModel.findById(directBuy.productId).select(
      "price quantity",
    );
    if (!productDoc) return notFound(res, "Product not found");

    const unitPrice = await resolveUnitPrice(productDoc._id, productDoc.price);
    const newOrder = new OrderModel({
      user: userId,
      productList: [
        {
          product: directBuy.productId,
          unitPrice,
          quantity: directBuy.quantity,
        },
      ],
      totalPrice: unitPrice * directBuy.quantity,
      paymentMethod,
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.CONFIRMED,
      ...(resolvedBankTranId && { bankTransactionId: resolvedBankTranId }),
    });
    await newOrder.save();
    const clientUrl = config.CLIENT_URL;
    const params = new URLSearchParams({
      orderId: String(newOrder._id),
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: ORDER_STATUS.CONFIRMED,
      paymentMethod,
    });
    return res.redirect(`${clientUrl}/order-success?${params}`);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0)
    return badRequest(res, "No cart found to place order");

  const newOrder = new OrderModel({
    user: userId,
    productList: cart.items,
    totalPrice: cart.totalPrice,
    paymentMethod,
    paymentStatus: PAYMENT_STATUS.PAID,
    orderStatus: ORDER_STATUS.CONFIRMED,
    ...(resolvedBankTranId && { bankTransactionId: resolvedBankTranId }),
  });

  await newOrder.save();
  await Cart.findOneAndDelete({ user: userId });

  const clientUrl = config.CLIENT_URL;
  const params = new URLSearchParams({
    orderId: String(newOrder._id),
    paymentStatus: PAYMENT_STATUS.PAID,
    orderStatus: ORDER_STATUS.CONFIRMED,
    paymentMethod,
  });
  return res.redirect(`${clientUrl}/order-success?${params}`);
});

export const getMyOrdersController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const userId = req.userId!;

    const orders = await OrderModel.find({ user: userId })
      .populate("productList.product", "productName productImage")
      .sort({ createdAt: -1 })
      .lean();

    return ok(res, undefined, orders);
  },
);

export const getAllOrdersAdminController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const orders = await OrderModel.find()
      .populate("user", "userName userEmail userPhoneNumber address")
      .populate("productList.product", "productName productImage")
      .sort({ createdAt: -1 })
      .lean();

    return ok(res, undefined, orders);
  },
);

export const cancelOrderController = asyncController<
  ValidatedRequest<{ params: TCancelOrderParamsSchema }>
>(async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;

  const order = await OrderModel.findOne({ _id: id, user: userId });
  if (!order) return notFound(res, "Order not found");

  if (order.orderStatus !== ORDER_STATUS.CONFIRMED)
    return badRequest(res, "Only confirmed orders can be cancelled");

  const updateFields: Record<string, unknown> = {
    orderStatus: ORDER_STATUS.CANCELLED,
  };

  let cancellationNote: string | undefined;
  if (
    order.paymentMethod === PAYMENT_METHOD.ONLINE_MOBILE_BANKING &&
    order.paymentStatus === PAYMENT_STATUS.PAID
  ) {
    cancellationNote = await buildCancellationNote();
    updateFields.cancellationNote = cancellationNote;
  }

  await OrderModel.findByIdAndUpdate(id, { $set: updateFields });

  return ok(res, "Order cancelled", {
    orderStatus: ORDER_STATUS.CANCELLED,
    ...(cancellationNote && { cancellationNote }),
  });
});

export const updateOrderStatusAdminController = asyncController<
  ValidatedRequest<{
    params: TUpdateOrderStatusAdminParamsSchema;
    body: TUpdateOrderStatusAdminBodySchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const { orderStatus: newStatus } = req.validatedBody;

  const order = await OrderModel.findById(id);
  if (!order) return notFound(res, "Order not found");

  const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.orderStatus];
  if (!allowedTransitions.includes(newStatus)) {
    return badRequest(
      res,
      `Cannot transition from ${order.orderStatus} to ${newStatus}`,
    );
  }

  const updateFields: Record<string, unknown> = { orderStatus: newStatus };

  if (
    newStatus === ORDER_STATUS.CANCELLED &&
    order.paymentMethod === PAYMENT_METHOD.ONLINE_MOBILE_BANKING &&
    order.paymentStatus === PAYMENT_STATUS.PAID
  ) {
    updateFields.cancellationNote = await buildCancellationNote();
  }

  await OrderModel.findByIdAndUpdate(id, { $set: updateFields });

  return ok(res, "Order status updated", {
    orderStatus: newStatus,
    ...(updateFields.cancellationNote
      ? { cancellationNote: updateFields.cancellationNote as string }
      : {}),
  });
});

export const refundOrderController = asyncController<
  ValidatedRequest<{ body: TRefundOrderValidationSchema }>
>(async (req, res) => {
  const userId = req.userId!;
  const { orderId, refund_amount, refund_remarks, bank_tran_id } =
    req.validatedBody;

  const order = await OrderModel.findOne({ _id: orderId, user: userId });
  if (!order) return notFound(res, "Order not found");

  if (order.paymentStatus !== PAYMENT_STATUS.PAID)
    return badRequest(res, "Only paid orders can be refunded");

  const ssl = getSslCredentials();
  if (!ssl)
    return badRequest(
      res,
      "SSL credentials are missing. Set SSL_STORE_ID and SSL_STORE_PASSWORD",
    );

  const refundRefId = `REF-${order._id.toString()}-${Date.now()}`;

  const refundResponse = (await sslcz.initiateRefund({
    refund_amount,
    refund_remarks,
    bank_tran_id,
    refe_id: refundRefId,
  })) as {
    status?: string;
    APIConnect?: string;
    refund_ref_id?: string;
  };

  await OrderModel.findByIdAndUpdate(orderId, {
    $set: {
      paymentStatus: PAYMENT_STATUS.REFUNDED,
      refundStatus: {
        refundId: refundResponse.refund_ref_id ?? refundRefId,
        amount: refund_amount,
        reason: refund_remarks,
        status: REFUND_STATUS.PENDING,
      },
    },
  });

  return ok(res, "Refund request initiated", refundResponse);
});
