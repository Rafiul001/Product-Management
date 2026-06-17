import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, Types } from "mongoose";

interface ISubCategoryModel {
  subCategoryName: string;
  category: Types.ObjectId;
  status: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type TSubCategoryDocument = TWithObjectId<ISubCategoryModel>;

const subCategorySchema = new Schema<ISubCategoryModel>(
  {
    subCategoryName: {
      type: String,
      required: true,
      min: [3, "Sub category must be at least 3 characters long"],
    },
    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: DB.CATEGORY,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SubCategoryModel = model(DB.SUB_CATEGORY, subCategorySchema);
