import z from "zod";
import { mongoId } from "./mongoId.validator.js";

export const createOfferValidationSchema = z
  .strictObject({
    title: z.string().min(2).max(100),
    description: z.string().min(2).max(500),
    badge: z.string().min(1).max(30),
    discountType: z.enum(["percentage", "flat"]),
    discountValue: z.coerce.number().positive(),
    applicableProducts: z.array(mongoId()).optional().default([]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => data.discountType !== "percentage" || data.discountValue <= 100,
    {
      message: "Percentage discount cannot exceed 100",
      path: ["discountValue"],
    },
  );

export type TCreateOfferValidationSchema = z.infer<
  typeof createOfferValidationSchema
>;

export const updateOfferValidationSchema = z.strictObject({
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(2).max(500).optional(),
  badge: z.string().min(1).max(30).optional(),
  discountType: z.enum(["percentage", "flat"]).optional(),
  discountValue: z.coerce.number().positive().optional(),
  applicableProducts: z.array(mongoId()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export type TUpdateOfferValidationSchema = z.infer<
  typeof updateOfferValidationSchema
>;

export const offerParamsValidationSchema = z.strictObject({
  id: mongoId(),
});

export type TOfferParamsValidationSchema = z.infer<
  typeof offerParamsValidationSchema
>;
