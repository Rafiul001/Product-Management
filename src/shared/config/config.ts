import dotenv from "dotenv";
dotenv.config();

// Every environment variable is required. If any is missing (or empty) the
// process throws on startup rather than silently falling back to a default.
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const EXPIRATION_TIME = "1d";
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const OTP_EXPIRATION_TIME = 2 * 60 * 1000;

const NODE_ENV = getEnv("NODE_ENV");
const IS_PRODUCTION = NODE_ENV === "production";
const PORT = parseInt(getEnv("PORT"), 10);

// Auth cookie options.
// In production the frontend (Netlify) and backend (Render) live on different
// domains, so cross-site cookies require `sameSite: "none"` + `secure: true`.
// In development everything is on localhost, so `lax` + non-secure works over http.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: (IS_PRODUCTION ? "none" : "lax") as "none" | "lax",
  path: "/",
};

// JWT secrets
const JSON_WEB_TOKEN_SECRET = getEnv("JSON_WEB_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");

// Database configuration
const DB_CONNECTION_URL = getEnv("DB_CONNECTION_URL");
const DATABASE = getEnv("DATABASE");

// Server URL
const SERVER_URL = getEnv("SERVER_URL");
const CLIENT_URL = getEnv("CLIENT_URL");

// File upload directory
const UPLOAD_DIR = getEnv("UPLOAD_DIR");

// Email (Gmail API over HTTPS — works on hosts that block outbound SMTP, e.g.
// Render, and needs no verified domain: it sends from your own Gmail account).
const GMAIL_CLIENT_ID = getEnv("GMAIL_CLIENT_ID");
const GMAIL_CLIENT_SECRET = getEnv("GMAIL_CLIENT_SECRET");
const GMAIL_REFRESH_TOKEN = getEnv("GMAIL_REFRESH_TOKEN");
// The sender. Either the bare Gmail address or `"Name <you@gmail.com>"`.
// Must be the same Gmail account the refresh token was issued for.
const EMAIL_FROM = getEnv("EMAIL_FROM");

// SSLCommerz credentials
const SSL_STORE_ID = getEnv("SSL_STORE_ID");
const SSL_STORE_PASSWORD = getEnv("SSL_STORE_PASSWORD");
const SSL_IS_LIVE = getEnv("SSL_IS_LIVE").toLowerCase() === "true";

const config = {
  PORT: PORT,
  NODE_ENV: NODE_ENV,
  IS_PRODUCTION: IS_PRODUCTION,
  COOKIE_OPTIONS: COOKIE_OPTIONS,
  JSON_WEB_TOKEN_SECRET: JSON_WEB_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
  DB_CONNECTION_URL: DB_CONNECTION_URL,
  DATABASE: DATABASE,
  SERVER_URL: SERVER_URL,
  CLIENT_URL: CLIENT_URL,
  UPLOAD_DIR: UPLOAD_DIR,
  EXPIRATION_TIME,
  COOKIE_MAX_AGE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  OTP_EXPIRATION_TIME,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN,
  EMAIL_FROM,
  SSL_STORE_ID,
  SSL_STORE_PASSWORD,
  SSL_IS_LIVE,
};

export default config;
