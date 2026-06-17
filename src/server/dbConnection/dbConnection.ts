import config from "@shared/config/config.js";
import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(`${config.DB_CONNECTION_URL}${config.DATABASE}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const dbDisconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
