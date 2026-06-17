import {
  createStockEntryController,
  deleteStockEntryController,
  getAllStockEntriesController,
  getStockEntryByIdController,
} from "@server/controllers/stockEntryController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import upload from "@server/middleware/uploader.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  createStockEntryValidationSchema,
  deleteStockEntryParamsValidationSchema,
  getStockEntryParamsValidationSchema,
} from "@shared/validators/stockEntry.validator.js";
import { Router } from "express";

const stockEntryRouter = Router();

stockEntryRouter.get(
  "/get-all",
  authenticator([ROLES.ADMIN]),
  getAllStockEntriesController,
);

stockEntryRouter.get(
  "/get/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", getStockEntryParamsValidationSchema),
  getStockEntryByIdController,
);

stockEntryRouter.post(
  "/create",
  authenticator([ROLES.ADMIN]),
  upload.single("challanImage"),
  validator("form", createStockEntryValidationSchema, "challanImage"),
  createStockEntryController,
);

stockEntryRouter.delete(
  "/delete/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", deleteStockEntryParamsValidationSchema),
  deleteStockEntryController,
);

export default stockEntryRouter;
