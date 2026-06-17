import z from "zod";
import { imageFile } from "./imageFile.validator.js";
import { mongoId } from "./mongoId.validator.js";

const productListItemSchema = z.object({
  product: mongoId(),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().positive(),
});

// Server-side schema: productList arrives as a JSON string from multipart form data
export const createStockEntryValidationSchema = z.strictObject({
  productList: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z
      .array(productListItemSchema)
      .min(1, "At least one product is required"),
  ),
  challanImage: imageFile(),
});

export type TCreateStockEntryValidationSchema = z.infer<
  typeof createStockEntryValidationSchema
>;

// Client-side schema: productList is already an array in the browser form,
// no JSON string parsing needed. This gives react-hook-form correct path types.
export const createStockEntryClientSchema = z.object({
  productList: z
    .array(productListItemSchema)
    .min(1, "At least one product is required"),
  challanImage: imageFile(),
});

export type TCreateStockEntryClientSchema = z.infer<
  typeof createStockEntryClientSchema
>;

export const getStockEntryParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TGetStockEntryParamsValidationSchema = z.infer<
  typeof getStockEntryParamsValidationSchema
>;

export const deleteStockEntryParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TDeleteStockEntryParamsValidationSchema = z.infer<
  typeof deleteStockEntryParamsValidationSchema
>;
