import {
  getCronSettingsController,
  updateCronSettingsController,
} from "@server/controllers/cronSettingsController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import { cronSettingsBodySchema } from "@shared/validators/order.validator.js";
import { Router } from "express";

const cronSettingsRouter = Router();

cronSettingsRouter.get(
  "/",
  authenticator([ROLES.ADMIN]),
  getCronSettingsController,
);

cronSettingsRouter.patch(
  "/",
  authenticator([ROLES.ADMIN]),
  validator("body", cronSettingsBodySchema),
  updateCronSettingsController,
);

export default cronSettingsRouter;
