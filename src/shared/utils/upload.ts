import config from "@shared/config/config.js";
import path from "node:path";

export const buildUploadUrl = (file: Express.Multer.File): string =>
  `${config.SERVER_URL}/uploads/${file.fieldname}/${file.filename}`;

export const urlToFilePath = (url: string): string => {
  const relativePath = url.split("/uploads/")[1] ?? "";
  return path.join(config.UPLOAD_DIR, relativePath);
};
