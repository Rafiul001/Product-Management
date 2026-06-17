import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, Types } from "mongoose";

interface INewArrivalModel {
  product: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type TNewArrivalDocument = TWithObjectId<INewArrivalModel>;

const newArrivalSchema = new Schema<INewArrivalModel>(
  {
    product: {
      type: Types.ObjectId,
      ref: DB.PRODUCT,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const NewArrivalModel = model(DB.NEW_ARRIVAL, newArrivalSchema);
