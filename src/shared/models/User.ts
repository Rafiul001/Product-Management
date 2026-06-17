import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema } from "mongoose";

interface IUserModel {
  userPhoneNumber: string;
  userName: string;
  userEmail: string;
  password: string;
  userImageUrl?: string;
  dateOfBirth: Date;
  address: string;
  otp?: string;
  otpExpiredAt?: Date;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type TUserDocument = TWithObjectId<IUserModel>;

const userSchema = new Schema<IUserModel>(
  {
    userPhoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImageUrl: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiredAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model(DB.USER, userSchema);
