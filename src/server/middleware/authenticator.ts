import { ROLES, type TROLE } from "@shared/constants/session/index.js";
import { SessionModel } from "@shared/models/Session.js";
import { unauthorized } from "@shared/utils/apiResponse.js";
import { verifyToken } from "@shared/utils/jwt.js";
import type { NextFunction, Request, Response } from "express";
/*
Get the token from cookies,
Verify the token,
TOKEN STRUCTURE:
{
  userId: string,
  role: TROLE,
  iat: number,
  exp: number
}
Match the role with the required role,
If all checks pass, call next() to proceed to the next middleware or route handler,
Otherwise, return a 401 Unauthorized response.
*/

export const authenticator =
  (roles: TROLE[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies;
      const token = cookies?.token;

      if (!token) {
        return unauthorized(res, "Unauthorized: No token provided");
      }

      // Verify the token and extract the payload
      const payload = verifyToken(token);

      if (!payload) {
        return unauthorized(res, "Unauthorized: Invalid token");
      }

      // Check if the user's role is in the allowed roles
      if (!roles.includes(payload.role)) {
        return unauthorized(res, "Forbidden: Insufficient permissions");
      }

      // ADMIN SESSION VALIDATION
      if (payload.role === ROLES.ADMIN) {
        if (!payload.sessionId) {
          return unauthorized(res, "Unauthorized: No session ID");
        }

        const session = await SessionModel.findOne({
          sessionId: payload.sessionId,
          userId: payload.userId,
          role: payload.role,
        });

        if (!session) {
          return unauthorized(res, "Unauthorized: Session not found");
        }

        // Check expiration
        if (session.expiresAt < new Date()) {
          // Delete expired session from DB
          await SessionModel.deleteOne({ sessionId: session.sessionId });
          return res
            .status(401)
            .json({ error: "Unauthorized: Session expired" });
        }
        req.sessionId = payload.sessionId; // Attach session ID to request for later use (e.g., logout)
      }

      // Attach user info (optional but recommended)
      req.userId = payload.userId;
      req.role = payload.role;

      // If everything is fine, proceed to the next middleware or route handler
      next();
    } catch (error) {
      next(error);
    }
  };
