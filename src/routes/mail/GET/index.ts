import { Mail, MailBox } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const routes = Express.Router();

routes.get(
  "/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const { id } = req.params;
      const mail = await Mail.getById(id!);
      const mailBox = await MailBox.get(mail!.mailBoxId!);
      const mailBoxTrackIds = _.map(mailBox!.tracks, ({ id }) => id);

      return res.status(StatusCodes.OK).json({
        likes: mailBoxTrackIds,
        mail,
      });
    } catch (err) {
      console.error(err);

      return next(err);
    }
  },
  []
);

export default routes;
