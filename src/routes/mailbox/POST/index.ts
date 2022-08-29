import { loginCheck } from "@middlewares";
import { MailBox } from "@models/types";
import { mailBoxImageUpload } from "@utils";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import { ReqPostMailBoxBody } from "./types";

const routes = Express.Router();

// 우체통 등록
routes.post(
  "/",
  loginCheck,
  mailBoxImageUpload,
  async (
    req: Express.Request<any, any, ReqPostMailBoxBody>,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const auth = req.auth;

    const { title } = req.body;
    const file = req.file;
    const path = file?.path;

    try {
      const mailBox = new MailBox(auth, title, path);
      const savedMailBox = await mailBox.save();

      return res.status(StatusCodes.CREATED).json(savedMailBox);
    } catch (err) {
      return next(err);
    }
  }
);

// 우체통 음악 등록
routes.post(
  "/music",
  loginCheck,
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    return res.send("test");
  }
);

export default routes;
