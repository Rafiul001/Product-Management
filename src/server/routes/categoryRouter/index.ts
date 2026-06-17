import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "@server/controllers/categoryController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createCategoryValidationSchema,
  deleteCategoryParamsValidationSchema,
  updateCategoryParamsValidationSchema,
  updateCategoryValidationSchema,
} from "@shared/validators/category.validator.js";
import { Router } from "express";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategoriesController);

categoryRouter.post(
  "/create",
  authenticator([ROLES.ADMIN]),
  validator("body", createCategoryValidationSchema),
  createCategoryController,
);

categoryRouter.put(
  "/update/:id",
  authenticator([ROLES.ADMIN]),
  validator("body", updateCategoryValidationSchema),
  validator("params", updateCategoryParamsValidationSchema),
  updateCategoryController,
);

categoryRouter.delete(
  "/delete/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", deleteCategoryParamsValidationSchema),
  deleteCategoryController,
);

export default categoryRouter;
