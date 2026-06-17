import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const createCategoryValidationSchema = z.strictObject({
  categoryName: z.string("Category name is required").min(2).max(100),
});

export type TCreateCategoryValidationSchema = z.infer<
  typeof createCategoryValidationSchema
>;

export const updateCategoryValidationSchema = z.strictObject({
  categoryName: z
    .string("Category name is required")
    .min(2)
    .max(100)
    .optional(),
  status: z.boolean().optional(),
});

export type TUpdateCategoryValidationSchema = z.infer<
  typeof updateCategoryValidationSchema
>;

export const updateCategoryParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TUpdateCategoryParamsValidationSchema = z.infer<
  typeof updateCategoryParamsValidationSchema
>;

export const deleteCategoryParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TDeleteCategoryParamsValidationSchema = z.infer<
  typeof deleteCategoryParamsValidationSchema
>;
