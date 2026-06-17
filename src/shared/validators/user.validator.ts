import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const registerUserBodySchema = z.strictObject({
  userPhoneNumber: z.string().length(11, "").optional(),
  userName: z.string().max(50),
  userEmail: z.email().optional(),
  password: z.string(),
  dateOfBirth: z.coerce.date(),
  address: z.string().max(250),
});

export type TRegisterBodySchema = z.infer<typeof registerUserBodySchema>;

export const verifyEmailBodyValidationSchema = z.strictObject({
  userEmail: z.email(),
  otp: z.string().length(6),
});

export type TVerifyEmailBodyValidationSchema = z.infer<
  typeof verifyEmailBodyValidationSchema
>;

export const resendVerificationEmailBodySchema = z.strictObject({
  userEmail: z.email(),
});

export type TResendVerificationEmailBodySchema = z.infer<
  typeof resendVerificationEmailBodySchema
>;

export const userLoginBodyValidationSchema = z.strictObject({
  userPhoneNumber: z.string().length(11).optional(),
  userEmail: z.email().optional(),
  password: z.string(),
});

export type TUserLoginBodySchema = z.infer<
  typeof userLoginBodyValidationSchema
>;

export const updateAddressValidationSchema = z.strictObject({
  address: z.string().min(1).max(250),
});

export type TUpdateAddressValidationSchema = z.infer<
  typeof updateAddressValidationSchema
>;

export const updateProfileValidationSchema = z.strictObject({
  userName: z.string().min(1).max(50),
  userEmail: z.email(),
  userPhoneNumber: z.string().length(11),
  dateOfBirth: z.coerce.date(),
});

export type TUpdateProfileValidationSchema = z.infer<
  typeof updateProfileValidationSchema
>;

export const updateUserAdminParamsSchema = z.strictObject({
  id: mongoId(),
});

export type TUpdateUserAdminParamsSchema = z.infer<
  typeof updateUserAdminParamsSchema
>;

export const updateUserAdminBodySchema = z.strictObject({
  userName: z.string().min(1).max(50).optional(),
  userEmail: z.email().optional(),
  userPhoneNumber: z.string().length(11).optional(),
  address: z.string().min(1).max(250).optional(),
});

export type TUpdateUserAdminBodySchema = z.infer<
  typeof updateUserAdminBodySchema
>;
