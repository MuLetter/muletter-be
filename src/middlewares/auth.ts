import { Auth } from "@models/types";
import Express from "express";

export async function loginCheck(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  return next();
}
