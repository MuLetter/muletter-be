import { RecommenderRun } from "@lib";
import { MailBox } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const routes = Express.Router();

routes.post(
  "/reply/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { id } = req.params;

    try {
      RecommenderRun(id);
      const mailBox = await MailBox.get(id);

      return res
        .status(StatusCodes.ACCEPTED)
        .json(_.filter(mailBox.tracks, ({ isUse }) => !isUse));
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

export default routes;
