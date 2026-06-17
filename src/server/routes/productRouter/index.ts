import {
  createProductController,
  deleteProductController,
  getAllProductsAdminController,
  getAllProductsController,
  getLatestProductsController,
  getProductByIdController,
  updateProductController,
} from "@server/controllers/productController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import upload from "@server/middleware/uploader.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createProductValidationSchema,
  deleteProductParamsValidationSchema,
  getAllProductsQueryValidationSchema,
  getProductParamsValidationSchema,
  updateProductParamsValidationSchema,
  updateProductValidationSchema,
} from "@shared/validators/product.validator.js";
import { Router } from "express";

const productRouter = Router();

productRouter.get(
  "/get-all",
  validator("query", getAllProductsQueryValidationSchema),
  getAllProductsController,
);

productRouter.get(
  "/admin/get-all",
  authenticator([ROLES.ADMIN]),
  validator("query", getAllProductsQueryValidationSchema),
  getAllProductsAdminController,
);

productRouter.get("/get-latest", getLatestProductsController);

productRouter.get(
  "/get/:id",
  validator("params", getProductParamsValidationSchema),
  getProductByIdController,
);

productRouter.post(
  "/create",
  authenticator([ROLES.ADMIN]),
  upload.single("productImage"),
  validator("form", createProductValidationSchema, "productImage"),
  createProductController,
);

productRouter.put(
  "/update/:id",
  authenticator([ROLES.ADMIN]),
  upload.single("productImage"),
  validator("form", updateProductValidationSchema, "productImage"),
  validator("params", updateProductParamsValidationSchema),
  updateProductController,
);

productRouter.delete(
  "/delete/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", deleteProductParamsValidationSchema),
  deleteProductController,
);

export default productRouter;
