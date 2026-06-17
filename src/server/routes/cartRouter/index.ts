import {
  addItemToCartController,
  deleteCartController,
  getCartController,
  removeItemFromCartController,
} from "@server/controllers/cartController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  addItemToCartValidationSchema,
  removeItemFromCartValidationSchema,
} from "@shared/validators/cart.validator.js";
import { Router } from "express";

const cartRouter = Router();

cartRouter.get("/get", authenticator([ROLES.USER]), getCartController);

cartRouter.patch(
  "/add-item",
  authenticator([ROLES.USER]),
  validator("body", addItemToCartValidationSchema),
  addItemToCartController,
);

cartRouter.patch(
  "/remove-item",
  authenticator([ROLES.USER]),
  validator("body", removeItemFromCartValidationSchema),
  removeItemFromCartController,
);

cartRouter.delete("/delete", authenticator([ROLES.USER]), deleteCartController);

export default cartRouter;
