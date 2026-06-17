import { DB } from "@shared/constants/DB.js";
import { ROLES, type TROLE } from "@shared/constants/session/index.js";
import type { TWithObjectId } from "@shared/types/withObjectId.js";
import { model, Schema } from "mongoose";

interface ISessionModel {
  sessionId: string;
  userId: string;
  role: TROLE;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type TSessionDocument = TWithObjectId<ISessionModel>;

const sessionSchema = new Schema<ISessionModel>(
  {
    sessionId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SessionModel = model(DB.SESSION, sessionSchema);
