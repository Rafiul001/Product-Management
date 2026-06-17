import {
  adminLoginController,
  adminLogoutController,
  getAdminInfoController,
} from "@server/controllers/adminController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import { loginBodySchemaValidator } from "@shared/validators/admin.validator.js";
import { Router } from "express";

const adminRouter = Router();

adminRouter.post(
  "/login",
  validator("body", loginBodySchemaValidator),
  adminLoginController,
);

adminRouter.get("/me", authenticator([ROLES.ADMIN]), getAdminInfoController);

adminRouter.post(
  "/logout",
  authenticator([ROLES.ADMIN]),
  adminLogoutController,
);

export default adminRouter;
