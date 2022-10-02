import { MailBox } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import { ReqMailDisLike, ReqMailLike } from "./types";

const routes = Express.Router();

routes.patch(
  "/like",
  async (
    req: Express.Request<any, any, ReqMailLike>,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { mailBoxId, track } = req.body;

    try {
      const mailBox = await MailBox.get(mailBoxId);
      const newMailBox = await mailBox.appendMusic(track);

      return res.status(StatusCodes.OK).json(newMailBox!.tracks);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

routes.patch(
  "/disLike",
  async (
    req: Express.Request<any, any, ReqMailDisLike>,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { mailBoxId, trackId } = req.body;

    try {
      const mailBox = await MailBox.get(mailBoxId);
      const newMailBox = await mailBox.pullTrack(trackId);

      return res.status(StatusCodes.OK).json(newMailBox!.tracks);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

export default routes;
