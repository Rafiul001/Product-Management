import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema, Types } from "mongoose";

interface IReviewModel {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment?: string;
  image: string[];
}

export type TReviewDocument = TWithObjectId<IReviewModel> & {
  createdAt: Date;
  updatedAt: Date;
};

const reviewSchema = new Schema<IReviewModel>(
  {
    product: {
      type: Types.ObjectId,
      ref: DB.PRODUCT,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: DB.USER,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    image: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const ReviewModel = model(DB.REVIEW, reviewSchema);
