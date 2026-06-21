import config from "@shared/config/config.js";
import nodemailer from "nodemailer";

// Create a transporter using SMTP.
export const transporter = nodemailer.createTransport(
  {
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE, // true for 465, false for 587 (STARTTLS)
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  },
  // Default sender for messages that don't specify `from`.
  { from: config.EMAIL_FROM },
);
