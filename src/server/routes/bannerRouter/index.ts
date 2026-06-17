import {
  createBannerController,
  deleteBannerController,
  getAllBannersController,
  getBannerByIdController,
  updateBannerController,
} from "@server/controllers/bannerController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import upload from "@server/middleware/uploader.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createBannerValidationSchema,
  deleteBannerParamsValidationSchema,
  getBannerParamsValidationSchema,
  updateBannerParamsValidationSchema,
  updateBannerValidationSchema,
} from "@shared/validators/banner.validator.js";
import { Router } from "express";

const bannerRouter = Router();

bannerRouter.get("/get-all", getAllBannersController);

bannerRouter.get(
  "/get/:id",
  validator("params", getBannerParamsValidationSchema),
  getBannerByIdController,
);

bannerRouter.post(
  "/create",
  authenticator([ROLES.ADMIN]),
  upload.single("image"),
  validator("form", createBannerValidationSchema, "image"),
  createBannerController,
);

bannerRouter.put(
  "/update/:id",
  authenticator([ROLES.ADMIN]),
  upload.single("image"),
  validator("form", updateBannerValidationSchema, "image"),
  validator("params", updateBannerParamsValidationSchema),
  updateBannerController,
);

bannerRouter.delete(
  "/delete/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", deleteBannerParamsValidationSchema),
  deleteBannerController,
);

export default bannerRouter;
