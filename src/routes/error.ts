import { StatusCodes, getReasonPhrase } from "http-status-codes";
import Express from "express";

export class ResponseError extends Error {
  statusCode: StatusCodes;

  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = getReasonPhrase(statusCode);
  }
}

export const ServerError = new ResponseError(
  StatusCodes.INTERNAL_SERVER_ERROR,
  "시스템 오류 입니다. 관리자에게 문의해주세요."
);

export function errorHandler(
  err: ResponseError,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  if (!err.hasOwnProperty("statusCode")) return next(ServerError);

  return res.status(err.statusCode).json({
    name: err.name,
    message: err.message,
  });
}
