import {
  addNewArrivalController,
  getAllNewArrivalsController,
  removeNewArrivalController,
} from "@server/controllers/newArrivalController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  addNewArrivalValidationSchema,
  removeNewArrivalParamsValidationSchema,
} from "@shared/validators/newArrival.validator.js";
import { Router } from "express";

const newArrivalRouter = Router();

newArrivalRouter.get("/get-all", getAllNewArrivalsController);

newArrivalRouter.post(
  "/add",
  authenticator([ROLES.ADMIN]),
  validator("body", addNewArrivalValidationSchema),
  addNewArrivalController,
);

newArrivalRouter.delete(
  "/remove/:productId",
  authenticator([ROLES.ADMIN]),
  validator("params", removeNewArrivalParamsValidationSchema),
  removeNewArrivalController,
);

export default newArrivalRouter;
