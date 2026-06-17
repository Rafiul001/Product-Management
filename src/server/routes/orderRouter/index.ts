import {
  cancelOrderController,
  confirmPaymentController,
  getAllOrdersAdminController,
  getMyOrdersController,
  placeOrderDirectController,
  placeOrderFromCartController,
  redirectToPaymentController,
  refundOrderController,
  updateOrderStatusAdminController,
} from "@server/controllers/orderController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  cancelOrderParamsSchema,
  confirmPaymentValidationSchema,
  placeOrderDirectValidationSchema,
  placeOrderFromCartValidationSchema,
  redirectToPaymentParamsValidationSchema,
  refundOrderValidationSchema,
  updateOrderStatusAdminBodySchema,
  updateOrderStatusAdminParamsSchema,
} from "@shared/validators/order.validator.js";
import { Router } from "express";

const orderRouter = Router();

orderRouter.get(
  "/my-orders",
  authenticator([ROLES.USER]),
  getMyOrdersController,
);

orderRouter.post(
  "/place-from-cart",
  authenticator([ROLES.USER]),
  validator("body", placeOrderFromCartValidationSchema),
  placeOrderFromCartController,
);

orderRouter.post(
  "/place-direct",
  authenticator([ROLES.USER]),
  validator("body", placeOrderDirectValidationSchema),
  placeOrderDirectController,
);

orderRouter.patch(
  "/:id/cancel",
  authenticator([ROLES.USER]),
  validator("params", cancelOrderParamsSchema),
  cancelOrderController,
);

orderRouter.get(
  "/redirect-to-payment/:checkoutId",
  authenticator([ROLES.USER]),
  validator("params", redirectToPaymentParamsValidationSchema),
  redirectToPaymentController,
);

orderRouter.post(
  "/confirm-payment",
  validator("body", confirmPaymentValidationSchema),
  confirmPaymentController,
);

orderRouter.post(
  "/refund",
  authenticator([ROLES.USER]),
  validator("body", refundOrderValidationSchema),
  refundOrderController,
);

orderRouter.get(
  "/admin/get-all",
  authenticator([ROLES.ADMIN]),
  getAllOrdersAdminController,
);

orderRouter.patch(
  "/admin/update-status/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", updateOrderStatusAdminParamsSchema),
  validator("body", updateOrderStatusAdminBodySchema),
  updateOrderStatusAdminController,
);

export default orderRouter;
