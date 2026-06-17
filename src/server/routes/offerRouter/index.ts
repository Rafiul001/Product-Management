import {
  createOfferController,
  deleteOfferController,
  getActiveOffersController,
  getAllOffersController,
  getOfferByIdController,
  updateOfferController,
} from "@server/controllers/offerController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createOfferValidationSchema,
  offerParamsValidationSchema,
  updateOfferValidationSchema,
} from "@shared/validators/offer.validator.js";
import { Router } from "express";

const offerRouter = Router();

offerRouter.get("/active", getActiveOffersController);

offerRouter.get(
  "/get-all",
  authenticator([ROLES.ADMIN]),
  getAllOffersController,
);

offerRouter.get(
  "/get/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", offerParamsValidationSchema),
  getOfferByIdController,
);

offerRouter.post(
  "/create",
  authenticator([ROLES.ADMIN]),
  validator("body", createOfferValidationSchema),
  createOfferController,
);

offerRouter.put(
  "/update/:id",
  authenticator([ROLES.ADMIN]),
  validator("body", updateOfferValidationSchema),
  validator("params", offerParamsValidationSchema),
  updateOfferController,
);

offerRouter.delete(
  "/delete/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", offerParamsValidationSchema),
  deleteOfferController,
);

export default offerRouter;
