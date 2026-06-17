import z from "zod";

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

export const mongoId = (message = "Invalid MongoDB ObjectId") =>
  z.string().regex(OBJECT_ID_REGEX, { message });
