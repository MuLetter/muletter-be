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
      const { auth } = req;
      const { id } = req.params;
      const mail = await Mail.getById(id!);
      const mailBox = await MailBox.get(mail!.mailBoxId!);
      const mailBoxTrackIds = _.map(mailBox!.tracks, ({ id }) => id);

      return res.status(StatusCodes.OK).json({
        mailBoxId: mailBox._id,
        likes: mailBoxTrackIds,
        mail,
        isMe: auth.id === mailBox.authId.toString(),
      });
    } catch (err) {
      console.error(err);

      return next(err);
    }
  },
  []
);

export default routes;
