import {
  createSubCategoryController,
  deleteSubCategoryController,
  getAllSubCategoryController,
  updateSubCategoryController,
} from "@server/controllers/subCategoryController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createSubCategoryValidationSchema,
  deleteSubCategoryParamsValidationSchema,
  updateSubCategoryParamsValidationSchema,
  updateSubCategoryValidationSchema,
} from "@shared/validators/subCategory.validator.js";
import { Router } from "express";

const subCategoryRouter = Router();

subCategoryRouter.get("/", getAllSubCategoryController);

subCategoryRouter.post(
  "/create",
  authenticator([ROLES.ADMIN]),
  validator("body", createSubCategoryValidationSchema),
  createSubCategoryController,
);

subCategoryRouter.put(
  "/update/:id",
  authenticator([ROLES.ADMIN]),
  validator("body", updateSubCategoryValidationSchema),
  validator("params", updateSubCategoryParamsValidationSchema),
  updateSubCategoryController,
);

subCategoryRouter.delete(
  "/delete/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", deleteSubCategoryParamsValidationSchema),
  deleteSubCategoryController,
);

export default subCategoryRouter;
