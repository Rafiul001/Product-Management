import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const createCartValidationSchema = z.strictObject({
  items: z.array(
    z.strictObject({
      product: mongoId(),
      unitPrice: z.number().min(0),
      quantity: z.number().min(1),
    }),
  ),
});

export type TCreateCartValidation = z.infer<typeof createCartValidationSchema>;

export const addItemToCartValidationSchema = z.strictObject({
  product: mongoId(),
  quantity: z.number().min(1),
});

export type TAddItemToCartValidation = z.infer<
  typeof addItemToCartValidationSchema
>;

export const removeItemFromCartValidationSchema = z.strictObject({
  product: mongoId(),
});

export type TRemoveItemFromCartValidation = z.infer<
  typeof removeItemFromCartValidationSchema
>;
