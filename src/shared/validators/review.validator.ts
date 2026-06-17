import z from "zod";
import { imageFile } from "./imageFile.validator.js";
import { mongoId } from "./mongoId.validator.js";

export const createReviewValidationSchema = z.strictObject({
  product: mongoId(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  image: imageFile().optional(),
});

export type TCreateReviewValidationSchema = z.infer<
  typeof createReviewValidationSchema
>;

export const updateReviewValidationSchema = z.strictObject({
  rating: z.coerce.number().int().min(1).max(5).optional(),
  comment: z.string().max(500).optional(),
  image: imageFile().optional(),
});

export type TUpdateReviewValidationSchema = z.infer<
  typeof updateReviewValidationSchema
>;

export const reviewParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TReviewParamsValidationSchema = z.infer<
  typeof reviewParamsValidationSchema
>;

export const getReviewsByProductParamsValidationSchema = z.strictObject({
  productId: mongoId(),
});

export type TGetReviewsByProductParamsValidationSchema = z.infer<
  typeof getReviewsByProductParamsValidationSchema
>;
