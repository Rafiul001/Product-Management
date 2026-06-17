import { roles } from "@shared/constants/session/index.js";
import z from "zod";

export const loginBodySchemaValidator = z.strictObject({
  adminUserName: z.string(),
  password: z.string(),
});

export type TLoginBodySchema = z.infer<typeof loginBodySchemaValidator>;

export const adminResponseSchemaValidator = z.strictObject({
  adminUserName: z.string(),
  adminEmail: z.string(),
  adminType: z.enum(roles),
});

export type TAdminResponseSchema = z.infer<typeof adminResponseSchemaValidator>;
