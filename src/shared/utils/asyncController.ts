import type { NextFunction, Request, Response } from "express";

type AsyncController<TReq = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export const asyncController = <TReq = Request>(fn: AsyncController<TReq>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as TReq, res, next).catch(next);
  };
};
