import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const addNewArrivalValidationSchema = z.strictObject({
  productId: mongoId(),
});

export type TAddNewArrivalValidationSchema = z.infer<
  typeof addNewArrivalValidationSchema
>;

export const removeNewArrivalParamsValidationSchema = z.strictObject({
  productId: mongoId(),
});

export type TRemoveNewArrivalParamsValidationSchema = z.infer<
  typeof removeNewArrivalParamsValidationSchema
>;
