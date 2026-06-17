import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

type TBodyFields = Exclude<TValidationFields, "form">;
type TValidationFields = "body" | "query" | "params" | "form";

export type ValidatedRequest<
  T extends {
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    query?: Record<string, unknown>;
  } = {},
> = Omit<Request, "validatedBody" | "validatedFile"> & {
  validatedBody: T["body"] extends Record<string, unknown>
    ? T["body"]
    : Record<string, unknown>;
  validatedFile?: Express.Multer.File | undefined;
  body: T["body"] extends Record<string, unknown>
    ? T["body"]
    : Record<string, unknown>;
  params: T["params"] extends Record<string, unknown>
    ? T["params"]
    : Record<string, unknown>;
  query: T["query"] extends Record<string, unknown>
    ? T["query"]
    : Record<string, unknown>;
};

export function validator<T extends z.ZodType>(
  validationField: "form",
  schema: T,
  fileField?: string,
): (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function validator<T extends z.ZodType>(
  validationField: TBodyFields,
  schema: T,
): (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function validator<T extends z.ZodType>(
  validationField: TValidationFields,
  schema: T,
  fileField = "file",
) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (validationField === "form") {
        const raw = { ...req.body, [fileField]: req.file };
        const validated = (await schema.parseAsync(raw)) as Record<
          string,
          unknown
        >;
        const { [fileField]: file, ...body } = validated;

        (
          req as unknown as ValidatedRequest<Record<string, unknown>>
        ).validatedBody = body;
        (
          req as unknown as ValidatedRequest<Record<string, unknown>>
        ).validatedFile = file as Express.Multer.File;
      } else {
        const validated = (await schema.parseAsync(
          req[validationField],
        )) as Record<string, unknown>;

        if (validationField === "body") {
          (
            req as unknown as ValidatedRequest<{
              body: Record<string, unknown>;
            }>
          ).validatedBody = validated;
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
