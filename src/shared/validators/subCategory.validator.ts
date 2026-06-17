import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const createSubCategoryValidationSchema = z.strictObject({
  subCategoryName: z.string().min(3, "Sub category name is required"),
  category: mongoId(),
});

export type TCreateSubCategoryValidationSchema = z.infer<
  typeof createSubCategoryValidationSchema
>;

export const updateSubCategoryValidationSchema = z.strictObject({
  subCategoryName: z
    .string()
    .min(3, "Sub category name is required")
    .optional(),
  status: z.boolean().optional(),
  category: mongoId().optional(),
});

export type TUpdateSubCategoryValidationSchema = z.infer<
  typeof updateSubCategoryValidationSchema
>;

export const updateSubCategoryParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TUpdateSubCategoryParamsValidationSchema = z.infer<
  typeof updateSubCategoryParamsValidationSchema
>;

export const deleteSubCategoryParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TDeleteSubCategoryParamsValidationSchema = z.infer<
  typeof deleteSubCategoryParamsValidationSchema
>;
