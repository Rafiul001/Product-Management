import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, type Types } from "mongoose";

interface IProductModel {
  productName: string;
  productImage?: string;
  subCategory: Types.ObjectId;
  description: string;
  quantity: number;
  price: number;
  productStatus: boolean;
  stockLimit: number;

  createdAt: Date;
  updatedAt: Date;
}

export type TProductDocument = TWithObjectId<IProductModel>;

const productSchema = new Schema<IProductModel>(
  {
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: DB.SUB_CATEGORY,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      min: [0, "Minimum should be 0"],
      default: 0,
      validate: {
        validator: function (value) {
          return value < this.get("stockLimit");
        },
        message: "Quantity must be less than or equal to stockLimit",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    productStatus: {
      type: Boolean,
      default: true,
    },
    stockLimit: {
      type: Number,
      min: [1, "Minimum stock limit should be 1"],
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ProductModel = model(DB.PRODUCT, productSchema);
