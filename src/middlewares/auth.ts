import { Auth } from "@models/types";
import Express from "express";

export async function loginCheck(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  const token = req.headers.authorization;
  try {
    const auth = await Auth.tokenCheck(token);
    req.auth = auth.toPlainObject();

    return next();
  } catch (err) {
    return next(err);
  }
}
