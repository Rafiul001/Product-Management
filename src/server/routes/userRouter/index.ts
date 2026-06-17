import {
  getAllUsersAdminController,
  getUserInfoController,
  getUserProfileController,
  loginUserController,
  logoutUserController,
  refreshAccessTokenController,
  registerUserController,
  resendVerificationEmailController,
  updateAddressController,
  updateProfileController,
  updateUserAdminController,
  verifyEmailController,
} from "@server/controllers/userController/index.js";
import { authenticator } from "@server/middleware/authenticator.js";
import { validator } from "@server/middleware/validator.js";
import { ROLES } from "@shared/constants/session/index.js";
import {
  registerUserBodySchema,
  resendVerificationEmailBodySchema,
  updateAddressValidationSchema,
  updateProfileValidationSchema,
  updateUserAdminBodySchema,
  updateUserAdminParamsSchema,
  userLoginBodyValidationSchema,
  verifyEmailBodyValidationSchema,
} from "@shared/validators/user.validator.js";
import { Router } from "express";

const userRouter = Router();

userRouter.post(
  "/register",
  validator("body", registerUserBodySchema),
  registerUserController,
);

userRouter.post(
  "/verify",
  validator("body", verifyEmailBodyValidationSchema),
  verifyEmailController,
);

userRouter.post(
  "/resend",
  validator("body", resendVerificationEmailBodySchema),
  resendVerificationEmailController,
);

userRouter.post(
  "/login",
  validator("body", userLoginBodyValidationSchema),
  loginUserController,
);

userRouter.post("/refresh", refreshAccessTokenController);

userRouter.get("/me", authenticator([ROLES.USER]), getUserInfoController);

userRouter.get(
  "/profile",
  authenticator([ROLES.USER]),
  getUserProfileController,
);

userRouter.patch(
  "/update-profile",
  authenticator([ROLES.USER]),
  validator("body", updateProfileValidationSchema),
  updateProfileController,
);

userRouter.patch(
  "/update-address",
  authenticator([ROLES.USER]),
  validator("body", updateAddressValidationSchema),
  updateAddressController,
);

userRouter.post("/logout", authenticator([ROLES.USER]), logoutUserController);

userRouter.get(
  "/admin/get-all",
  authenticator([ROLES.ADMIN]),
  getAllUsersAdminController,
);

userRouter.patch(
  "/admin/update/:id",
  authenticator([ROLES.ADMIN]),
  validator("params", updateUserAdminParamsSchema),
  validator("body", updateUserAdminBodySchema),
  updateUserAdminController,
);

export default userRouter;
