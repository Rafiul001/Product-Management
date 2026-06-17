import {
  createReviewController,
  deleteReviewController,
  getReviewsByProductController,
  updateReviewController,
} from "@server/controllers/reviewController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createReviewValidationSchema,
  getReviewsByProductParamsValidationSchema,
  reviewParamsValidationSchema,
  updateReviewValidationSchema,
} from "@shared/validators/review.validator.js";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.get(
  "/product/:productId",
  validator("params", getReviewsByProductParamsValidationSchema),
  getReviewsByProductController,
);

reviewRouter.post(
  "/create",
  authenticator([ROLES.USER]),
  validator("body", createReviewValidationSchema),
  createReviewController,
);

reviewRouter.put(
  "/update/:id",
  authenticator([ROLES.USER]),
  validator("body", updateReviewValidationSchema),
  validator("params", reviewParamsValidationSchema),
  updateReviewController,
);

reviewRouter.delete(
  "/delete/:id",
  authenticator([ROLES.USER, ROLES.ADMIN]),
  validator("params", reviewParamsValidationSchema),
  deleteReviewController,
);

export default reviewRouter;
