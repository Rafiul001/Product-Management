import config from "@shared/config/config.js";
import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    // Use the `dbName` option instead of string-concatenating the database name
    // onto the URL. This works for both local URLs (mongodb://host:27017/) and
    // MongoDB Atlas SRV URLs that carry a query string
    // (mongodb+srv://.../db?appName=...), where concatenation would corrupt the URI.
    await mongoose.connect(config.DB_CONNECTION_URL, {
      dbName: config.DATABASE,
    });
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
