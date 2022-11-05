import { RecommenderRun } from "@lib";
import { MailBox } from "@models/types";
import { ReqIdParams } from "@routes/common";
import { mailBoxImageUpload } from "@utils";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import { ReqPostMailBoxBody, ReqPostTracksBody } from "./types";

const routes = Express.Router();

// 우체통 등록
routes.post(
  "/",
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
      const mailBox = new MailBox({
        authId: auth.id,
        title: title,
        image: path,
      } as any);
      const savedMailBox = await mailBox.save();

      return res.status(StatusCodes.CREATED).json(savedMailBox);
    } catch (err) {
      return next(err);
    }
  }
);

// 우체통 음악 등록
routes.post(
  "/:id",
  async (
    req: Express.Request<ReqIdParams, any, ReqPostTracksBody>,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { id } = req.params;
    const { tracks } = req.body;

    try {
      const mailBox = await MailBox.get(id);
      const newMailBox = await mailBox.appendTracks(tracks);

      RecommenderRun(id);

      return res.status(StatusCodes.OK).json(newMailBox);
    } catch (err) {
      return next(err);
    }
  }
);

export default routes;
