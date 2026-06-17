import config from "@shared/config/config.js";
import jsonWebToken from "jsonwebtoken";
import type { TROLE } from "../constants/session/index.js";

type TJwtPayload = {
  userId: string;
  role: TROLE;
  sessionId?: string;
  iat: number;
  exp: number;
};

type TRefreshTokenPayload = {
  userId: string;
  role: TROLE;
  iat: number;
  exp: number;
};

export const generateToken = (payload: TJwtPayload) => {
  try {
    const token = jsonWebToken.sign(payload, config.JSON_WEB_TOKEN_SECRET, {
      algorithm: "HS256",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Error generating token");
  }
};

export const verifyToken = (token: string): TJwtPayload | null => {
  try {
    const decoded = jsonWebToken.verify(
      token,
      config.JSON_WEB_TOKEN_SECRET,
    ) as TJwtPayload;
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Error verifying token");
  }
};

export const generateRefreshToken = (payload: TRefreshTokenPayload) => {
  try {
    return jsonWebToken.sign(payload, config.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
    });
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Error generating refresh token");
  }
};

export const verifyRefreshToken = (token: string): TRefreshTokenPayload | null => {
  try {
    return jsonWebToken.verify(
      token,
      config.REFRESH_TOKEN_SECRET,
    ) as TRefreshTokenPayload;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return null;
  }
};
