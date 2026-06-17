import z from "zod";
import { imageFile } from "./imageFile.validator.js";
import { mongoId } from "./mongoId.validator.js";

export const getBannerParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TGetBannerParamsValidationSchema = z.infer<
  typeof getBannerParamsValidationSchema
>;

export const createBannerValidationSchema = z.strictObject({
  title: z.string().min(2).max(100),
  description: z.string().max(500),
  link: z.string().url(),
  image: imageFile(),
});

export type TCreateBannerValidationSchema = z.infer<
  typeof createBannerValidationSchema
>;

export const updateBannerValidationSchema = z.strictObject({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  link: z.string().url().optional(),
  image: imageFile().optional(),
});

export type TUpdateBannerValidationSchema = z.infer<
  typeof updateBannerValidationSchema
>;

export const updateBannerParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TUpdateBannerParamsValidationSchema = z.infer<
  typeof updateBannerParamsValidationSchema
>;

export const deleteBannerParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TDeleteBannerParamsValidationSchema = z.infer<
  typeof deleteBannerParamsValidationSchema
>;
