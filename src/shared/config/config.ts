import dotenv from "dotenv";
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
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

const NODE_ENV = getEnv("NODE_ENV", "development");
const PORT = parseInt(getEnv("PORT", "3000"), 10);

// JWT secrets
const JSON_WEB_TOKEN_SECRET = getEnv("JSON_WEB_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET", "refresh_secret_key");

// Database configuration
const DB_CONNECTION_URL = getEnv("DB_CONNECTION_URL");
const DATABASE = getEnv("DATABASE");

// Server URL
const SERVER_URL = getEnv("SERVER_URL", "http://localhost:3000");
const CLIENT_URL = getEnv("CLIENT_URL", "http://localhost:5173");

// File upload directory
const UPLOAD_DIR = getEnv("UPLOAD_DIR", "uploads/");

// Email credentials
const EMAIL_USER = getEnv("EMAIL_USER");
const EMAIL_PASS = getEnv("EMAIL_PASS");

// SSLCommerz credentials
const SSL_STORE_ID = getEnv("SSL_STORE_ID");
const SSL_STORE_PASSWORD = getEnv("SSL_STORE_PASSWORD");
const SSL_IS_LIVE = getEnv("SSL_IS_LIVE", "false").toLowerCase() === "true";

const config = {
  PORT: PORT,
  NODE_ENV: NODE_ENV,
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
  EMAIL_USER,
  EMAIL_PASS,
  SSL_STORE_ID,
  SSL_STORE_PASSWORD,
  SSL_IS_LIVE,
};

export default config;
