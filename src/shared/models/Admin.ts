import { ADMIN_TYPES } from "@shared/constants/admin/index.js";
import { DB } from "@shared/constants/DB.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema } from "mongoose";

interface IAdminModel {
  adminUserName: string;
  adminEmail: string;
  password: string;
  adminType: (typeof ADMIN_TYPES)[keyof typeof ADMIN_TYPES];

  createdAt: Date;
  updatedAt: Date;
}

export type TAdminDocument = TWithObjectId<IAdminModel>;

const adminSchema = new Schema<IAdminModel>(
  {
    adminUserName: {
      type: String,
      required: true,
      unique: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    adminType: {
      type: String,
      enum: Object.values(ADMIN_TYPES),
      required: true,
      default: ADMIN_TYPES.SECONDARY_ADMIN,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const AdminModel = model(DB.ADMIN, adminSchema);

export { ADMIN_TYPES, AdminModel };
