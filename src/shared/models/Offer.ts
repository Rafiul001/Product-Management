import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, type Types } from "mongoose";

interface IOfferModel {
  title: string;
  description: string;
  badge: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  applicableProducts: Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type TOfferDocument = TWithObjectId<IOfferModel>;

const offerSchema = new Schema<IOfferModel>(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    badge: {
      type: String,
      required: true,
      maxlength: 30,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: DB.PRODUCT }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OfferModel = model<IOfferModel>(DB.OFFER, offerSchema);
