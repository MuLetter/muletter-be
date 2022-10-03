import { MailBox, Mail } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
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
    const { id } = req.params;

    try {
      const test = await Mail.getListByMailBoxId(id);

      return res.status(StatusCodes.OK).json(test);
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
