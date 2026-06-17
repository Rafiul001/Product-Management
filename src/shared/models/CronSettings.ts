import { DB } from "@shared/constants/DB.js";
import { model, Schema } from "mongoose";

interface ICronSettings {
  startHour: number;
  endHour: number;
  createdAt: Date;
  updatedAt: Date;
}

const cronSettingsSchema = new Schema<ICronSettings>(
  {
    startHour: { type: Number, required: true, min: 0, max: 23, default: 9 },
    endHour: { type: Number, required: true, min: 0, max: 23, default: 17 },
  },
  { timestamps: true, versionKey: false },
);

export const CronSettingsModel = model(DB.CRON_SETTINGS, cronSettingsSchema);
