import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema } from "mongoose";

interface IBannerModel {
  image: string;
  link: string;
  title: string;
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export type TBannerDocument = TWithObjectId<IBannerModel>;

const bannerSchema = new Schema<IBannerModel>(
  {
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Banner = model(DB.BANNER, bannerSchema);
