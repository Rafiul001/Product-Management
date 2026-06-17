import z from "zod";
import { imageFile } from "./imageFile.validator.js";
import { mongoId } from "./mongoId.validator.js";

export const getProductParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TGetProductParamsValidationSchema = z.infer<
  typeof getProductParamsValidationSchema
>;

export const createProductValidationSchema = z.strictObject({
  productName: z.string().min(2).max(100),
  subCategory: mongoId(),
  price: z.coerce.number().positive(),
  description: z.string().max(200),
  stockLimit: z.coerce.number().nonnegative(),
  productImage: imageFile().optional(),
});

export type TCreateProductValidationSchema = z.infer<
  typeof createProductValidationSchema
>;

export const updateProductValidationSchema = z.strictObject({
  productName: z.string().min(2).max(100).optional(),
  subCategory: mongoId().optional(),
  price: z.coerce.number().positive().optional(),
  description: z.string().max(200).optional(),
  stockLimit: z.coerce.number().nonnegative().optional(),
  productStatus: z
    .preprocess(
      (val) => (typeof val === "string" ? val === "true" : val),
      z.boolean(),
    )
    .optional(),
  productImage: imageFile().optional(),
});

export type TUpdateProductValidationSchema = z.infer<
  typeof updateProductValidationSchema
>;

export const updateProductParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TUpdateProductParamsValidationSchema = z.infer<
  typeof updateProductParamsValidationSchema
>;

export const deleteProductParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TDeleteProductParamsValidationSchema = z.infer<
  typeof deleteProductParamsValidationSchema
>;

export const getAllProductsQueryValidationSchema = z.object({
  search: z.string().optional(),
  categories: z.string().optional(),
  subCategories: z.string().optional(),
  minPrice: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().nonnegative().optional(),
  ),
  maxPrice: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().positive().optional(),
  ),
  sortBy: z.enum(["productName", "price", "category"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  productStatus: z.enum(["true", "false"]).optional(),
  newArrivalOnly: z.preprocess((val) => val === "true", z.boolean()).optional(),
  inStock: z.string().optional(),
  page: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().int().positive().optional(),
  ),
  limit: z.preprocess(
    (val) =>
      val === "" || val === undefined || val === null ? undefined : Number(val),
    z.number().int().positive().max(100).optional(),
  ),
});

export type TGetAllProductsQueryValidationSchema = z.infer<
  typeof getAllProductsQueryValidationSchema
>;
