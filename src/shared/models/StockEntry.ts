import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, Types } from "mongoose";

interface IProductListItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
}

interface IStockEntryModel {
  productList: IProductListItem[];
  totalCost: number;
  challanImage: string;

  createdAt: Date;
  updatedAt: Date;
}

export type TStockEntryDocument = TWithObjectId<IStockEntryModel>;

const stockEntrySchema = new Schema<IStockEntryModel>(
  {
    productList: {
      type: [
        {
          product: {
            type: Types.ObjectId,
            ref: DB.PRODUCT,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          unitPrice: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    totalCost: {
      type: Number,
      required: true,
    },
    challanImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

stockEntrySchema.pre("save", function () {
  this.totalCost = this.productList.reduce((sum, product) => {
    return (sum += product.quantity * product.unitPrice);
  }, 0);
});

export const StockEntryModel = model(DB.STOCK_ENTRY, stockEntrySchema);
