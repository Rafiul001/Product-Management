import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema } from "mongoose";

interface ICategoryModel {
  categoryName: string;
  status: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type TCategoryDocument = TWithObjectId<ICategoryModel>;

const categorySchema = new Schema<ICategoryModel>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      min: [3, "Sub category must be at least 3 characters long"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const CategoryModel = model(DB.CATEGORY, categorySchema);

export { CategoryModel };
