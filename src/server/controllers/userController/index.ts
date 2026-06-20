import type { ValidatedRequest } from "@server/middleware/validator.js";
import { transporter } from "@server/services/email/transporter.js";
import config from "@shared/config/config.js";
import { ROLES } from "@shared/constants/session/index.js";
import { UserModel } from "@shared/models/User.js";
import {
  badRequest,
  conflict,
  notFound,
  ok,
  serverError,
  tooManyRequest,
  unauthorized,
} from "@shared/utils/apiResponse.js";
import { asyncController } from "@shared/utils/asyncController.js";
import {
  generateRefreshToken,
  generateToken,
  verifyRefreshToken,
} from "@shared/utils/jwt.js";
import { getOtp } from "@shared/utils/otpGenerator.js";
import { otpMail } from "@shared/utils/otpMailer.js";
import {
  hashPassowrd,
  verifyPassword,
} from "@shared/utils/passwordEncrypter.js";
import type {
  TRegisterBodySchema,
  TResendVerificationEmailBodySchema,
  TUpdateAddressValidationSchema,
  TUpdateProfileValidationSchema,
  TUpdateUserAdminBodySchema,
  TUpdateUserAdminParamsSchema,
  TUserLoginBodySchema,
  TVerifyEmailBodyValidationSchema,
} from "@shared/validators/user.validator.js";

export const registerUserController = asyncController<
  ValidatedRequest<{ body: TRegisterBodySchema }>
>(async (req, res) => {
  const {
    userPhoneNumber,
    userName,
    userEmail,
    password,
    dateOfBirth,
    address,
  } = req.validatedBody;

  const existingUser = await UserModel.findOne({
    $or: [
      ...(userPhoneNumber ? [{ userPhoneNumber }] : []),
      ...(userEmail ? [{ userEmail }] : []),
    ],
  });

  if (existingUser)
    return conflict(
      res,
      existingUser.userPhoneNumber === userPhoneNumber
        ? "Phone number already in use"
        : "Email already in use",
    );

  const encryptedPassword = await hashPassowrd(password);

  const otp = getOtp();
  const otpExpiredAt = new Date(Date.now() + config.OTP_EXPIRATION_TIME);

  const newUser = new UserModel({
    userPhoneNumber,
    userName,
    userEmail,
    password: encryptedPassword,
    dateOfBirth,
    address,
    otp,
    otpExpiredAt,
  });

  await newUser.save();

  try {
    await transporter.sendMail(otpMail(newUser.userEmail, newUser.otp!));
  } catch (emailError) {
    console.error("Failed to send OTP email:", emailError);
  }

  return ok(res, "User registered successfully. Please verify your email.");
});

export const verifyEmailController = asyncController<
  ValidatedRequest<{ body: TVerifyEmailBodyValidationSchema }>
>(async (req, res) => {
  const { userEmail, otp } = req.validatedBody;

  const existingUser = await UserModel.findOne({
    userEmail: userEmail,
  });

  if (!existingUser) return notFound(res, "User not found");
  if (existingUser.isVerified)
    return conflict(res, "This user is already verified");

  if (existingUser.otpExpiredAt && existingUser.otpExpiredAt < new Date()) {
    await UserModel.updateOne(
      { _id: existingUser._id },
      {
        $set: {
          otp: null,
          otpExpiredAt: null,
        },
      },
    );
    return badRequest(res, "OTP Expired");
  }

  if (existingUser.otp !== otp)
    return badRequest(res, "OTP didn't match. Please try again");

  await UserModel.updateOne(
    { _id: existingUser._id },
    {
      $set: {
        isVerified: true,
        otp: null,
        otpExpiredAt: null,
      },
    },
  );

  return ok(res, "Email verified successfully");
});

export const resendVerificationEmailController = asyncController<
  ValidatedRequest<{ body: TResendVerificationEmailBodySchema }>
>(async (req, res) => {
  const { userEmail } = req.validatedBody;
  const existingUser = await UserModel.findOne({
    userEmail: userEmail,
  });

  if (!existingUser) return notFound(res, "Invalid email");

  if (existingUser.isVerified) return conflict(res, "Already verified");

  if (existingUser.otpExpiredAt && existingUser.otpExpiredAt > new Date())
    return tooManyRequest(res, "Wait before next otp");

  const otp = getOtp();
  existingUser.otp = otp;
  existingUser.otpExpiredAt = new Date(Date.now() + config.OTP_EXPIRATION_TIME);
  await existingUser.save();

  try {
    await transporter.sendMail(otpMail(userEmail, otp));
  } catch (emailError) {
    console.error("Failed to send OTP email:", emailError);
    const detail =
      emailError instanceof Error ? emailError.message : "Unknown error";
    return serverError(res, `Failed to send OTP email: ${detail}`);
  }

  return ok(res, "Otp send successfully");
});

export const loginUserController = asyncController<
  ValidatedRequest<{ body: TUserLoginBodySchema }>
>(async (req, res) => {
  const { userPhoneNumber, userEmail, password } = req.validatedBody;

  const existingUser = await UserModel.findOne({
    $or: [
      ...(userPhoneNumber ? [{ userPhoneNumber }] : []),
      ...(userEmail ? [{ userEmail }] : []),
    ],
  });

  if (!existingUser) return unauthorized(res, "Invalid credentials");

  const isMatch = await verifyPassword(password, existingUser.password);
  if (!isMatch) return unauthorized(res, "Invalid credentials");

  if (!existingUser.isVerified) return conflict(res, "Verify your email first");

  const now = Date.now();
  const userId = existingUser._id.toString();

  const accessToken = generateToken({
    userId,
    role: ROLES.USER,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + config.ACCESS_TOKEN_MAX_AGE / 1000,
  });

  const refreshToken = generateRefreshToken({
    userId,
    role: ROLES.USER,
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + config.REFRESH_TOKEN_MAX_AGE / 1000,
  });

  const cookieOptions = config.COOKIE_OPTIONS;

  res.cookie("token", accessToken, {
    ...cookieOptions,
    maxAge: config.ACCESS_TOKEN_MAX_AGE,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: config.REFRESH_TOKEN_MAX_AGE,
  });

  return ok(res, "Login successful");
});

export const refreshAccessTokenController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return unauthorized(res, "No refresh token provided");

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) return unauthorized(res, "Invalid or expired refresh token");

    const now = Date.now();

    const newAccessToken = generateToken({
      userId: payload.userId,
      role: payload.role,
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + config.ACCESS_TOKEN_MAX_AGE / 1000,
    });

    res.cookie("token", newAccessToken, {
      ...config.COOKIE_OPTIONS,
      maxAge: config.ACCESS_TOKEN_MAX_AGE,
    });

    return ok(res, "Token refreshed");
  },
);

export const getUserInfoController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const user = await UserModel.findById(req.userId)
      .select("userName userEmail userPhoneNumber userImageUrl")
      .lean();

    if (!user) return notFound(res, "User not found");

    return ok(res, undefined, user);
  },
);

export const getUserProfileController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const user = await UserModel.findById(req.userId)
      .select(
        "userName userEmail userPhoneNumber userImageUrl address dateOfBirth",
      )
      .lean();

    if (!user) return notFound(res, "User not found");

    return ok(res, undefined, user);
  },
);

export const updateProfileController = asyncController<
  ValidatedRequest<{ body: TUpdateProfileValidationSchema }>
>(async (req, res) => {
  const { userName, userEmail, userPhoneNumber, dateOfBirth } =
    req.validatedBody;

  const conflict = await UserModel.findOne({
    _id: { $ne: req.userId },
    $or: [{ userEmail }, { userPhoneNumber }],
  });

  if (conflict)
    return badRequest(
      res,
      conflict.userEmail === userEmail
        ? "Email already in use by another account"
        : "Phone number already in use by another account",
    );

  const user = await UserModel.findByIdAndUpdate(
    req.userId,
    { $set: { userName, userEmail, userPhoneNumber, dateOfBirth } },
    { new: true },
  ).select("userName userEmail userPhoneNumber dateOfBirth");

  if (!user) return notFound(res, "User not found");

  return ok(res, "Profile updated successfully", {
    userName: user.userName,
    userEmail: user.userEmail,
    userPhoneNumber: user.userPhoneNumber,
    dateOfBirth: user.dateOfBirth,
  });
});

export const updateAddressController = asyncController<
  ValidatedRequest<{ body: TUpdateAddressValidationSchema }>
>(async (req, res) => {
  const { address } = req.validatedBody;

  const user = await UserModel.findByIdAndUpdate(
    req.userId,
    { $set: { address } },
    { new: true },
  ).select("address");

  if (!user) return notFound(res, "User not found");

  return ok(res, "Address updated successfully", { address: user.address });
});

export const getAllUsersAdminController = asyncController<ValidatedRequest>(
  async (_req, res) => {
    const users = await UserModel.find()
      .select(
        "userName userEmail userPhoneNumber address dateOfBirth isVerified createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return ok(res, undefined, users);
  },
);

export const updateUserAdminController = asyncController<
  ValidatedRequest<{
    params: TUpdateUserAdminParamsSchema;
    body: TUpdateUserAdminBodySchema;
  }>
>(async (req, res) => {
  const { id } = req.params;
  const { userName, userEmail, userPhoneNumber, address } = req.validatedBody;

  if (userEmail || userPhoneNumber) {
    const duplicate = await UserModel.findOne({
      _id: { $ne: id },
      $or: [
        ...(userEmail ? [{ userEmail }] : []),
        ...(userPhoneNumber ? [{ userPhoneNumber }] : []),
      ],
    });

    if (duplicate)
      return badRequest(
        res,
        duplicate.userEmail === userEmail
          ? "Email already in use by another account"
          : "Phone number already in use by another account",
      );
  }

  const user = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        ...(userName && { userName }),
        ...(userEmail && { userEmail }),
        ...(userPhoneNumber && { userPhoneNumber }),
        ...(address && { address }),
      },
    },
    { new: true },
  ).select("userName userEmail userPhoneNumber address");

  if (!user) return notFound(res, "User not found");

  return ok(res, "User updated successfully", user);
});

export const logoutUserController = asyncController<ValidatedRequest>(
  async (req, res) => {
    const cookieOptions = config.COOKIE_OPTIONS;

    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return ok(res, "Logout successful");
  },
);
