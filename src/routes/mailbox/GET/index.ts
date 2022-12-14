import { MailBox, Mail } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import { request } from "https";
import _ from "lodash";

const routes = Express.Router();

routes.get(
  "/",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { id } = req.auth;

    try {
      const mailBoxes = await MailBox.getListByAuthId(id);
      return res.status(StatusCodes.OK).json(mailBoxes);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

routes.get(
  "/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { auth } = req;
    const { id } = req.params;

    try {
      const mailbox = await MailBox.get(id, {
        includeUse: true,
        likeCheck: auth.id,
      });
      const mails = await Mail.getListByMailBoxId(id);

      return res.status(StatusCodes.OK).json({ mailbox, mails });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

routes.get(
  "/unuse/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { id } = req.params;
    try {
      const mailBox = await MailBox.get(id);

      return res
        .status(StatusCodes.OK)
        .json(_.filter(mailBox!.tracks, ({ isUse }) => !isUse));
    } catch (err) {
      console.error(err);

      return next(err);
    }
  }
);

export default routes;
