import type { ValidatedRequest } from "@server/middleware/validator.js";
import config from "@shared/config/config.js";
import { ROLES } from "@shared/constants/session/index.js";
import { AdminModel } from "@shared/models/Admin.js";
import { SessionModel } from "@shared/models/Session.js";
import { notFound, ok, unauthorized } from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import { generateToken } from "@shared/utils/jwt.js";
import { verifyPassword } from "@shared/utils/passwordEncrypter.js";
import type { TLoginBodySchema } from "@shared/validators/admin.validator.js";

export const adminLoginController = asyncController<
  ValidatedRequest<{ body: TLoginBodySchema }>
>(async (req, res) => {
  const { adminUserName, password } = req.validatedBody;
  const exists = await AdminModel.findOne({
    adminUserName: adminUserName,
  }).lean();

  if (!exists) return unauthorized(res, "Invalid username or password");
  const isVerified = await verifyPassword(password, exists.password);
  if (!isVerified) return unauthorized(res, "Invalid username or password");

  const now = Date.now();

  const sessionId = crypto.randomUUID();
  const sessionData = new SessionModel({
    sessionId: sessionId,
    userId: exists._id,
    role: ROLES.ADMIN,
    expiresAt: new Date(now + config.COOKIE_MAX_AGE),
  });

  await sessionData.save();

  const token = generateToken({
    userId: exists._id.toString(),
    role: ROLES.ADMIN,
    sessionId: sessionId,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + config.COOKIE_MAX_AGE / 1000,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    maxAge: config.COOKIE_MAX_AGE,
    sameSite: "strict",
    path: "/",
  });

  return ok(res, "Successfully logged in");
});

export const getAdminInfoController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const existingAdmin = await AdminModel.findOne({
      _id: req.userId,
    })
      .select("adminUserName adminEmail adminType")
      .lean();

    if (!existingAdmin) return notFound(res, "Admin not found");

    return ok(res, undefined, existingAdmin);
  },
);

export const adminLogoutController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const sessionId = req.sessionId;
    if (sessionId) await SessionModel.deleteOne({ sessionId: sessionId });

    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return ok(res, "Successfully logged out");
  },
);
