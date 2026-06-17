import type { Response } from "express";

const apiResponse = <T>(
  res: Response,
  statusCode: number,
  message?: string,
  data?: T,
) => {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    ...(message && { message }),
    ...(data !== undefined && { data }),
  });
};

export const ok = <T>(res: Response, message?: string, data?: T) =>
  apiResponse(res, 200, message, data);

export const created = <T>(res: Response, message?: string, data?: T) =>
  apiResponse(res, 201, message, data);

export const badRequest = (res: Response, message = "Bad request") =>
  apiResponse(res, 400, message);

export const unauthorized = (res: Response, message = "Unauthorized") =>
  apiResponse(res, 401, message);

export const forbidden = (res: Response, message = "Forbidden") =>
  apiResponse(res, 403, message);

export const notFound = (res: Response, message = "Not found") =>
  apiResponse(res, 404, message);

export const conflict = (res: Response, message = "Conflict") =>
  apiResponse(res, 409, message);

export const tooManyRequest = (res: Response, message = "Too many request") =>
  apiResponse(res, 429, message);

export const serverError = (res: Response, message = "Internal server error") =>
  apiResponse(res, 500, message);
