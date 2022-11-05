import { MailBoxModel } from "@models";
import { MailBox } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const routes = Express.Router();

routes.patch(
  "/like/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { auth } = req;
    const { id } = req.params;
    try {
      const mailbox = await MailBox.get(id!);

      const likes = mailbox.likes;
      let newLikes: string[] = [];
      if (likes) {
        newLikes = _.concat(likes, auth.id);
      } else {
        newLikes = [auth.id];
      }

      await MailBoxModel.updateOne({ _id: id }, { likes: newLikes });

      return res.status(StatusCodes.OK).json({
        status: true,
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

routes.patch(
  "/dislike/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { auth } = req;
    const { id } = req.params;
    try {
      const mailbox = await MailBox.get(id!);

      const likes = mailbox.likes;
      let newLikes: string[] = [];
      if (likes) {
        newLikes = _.filter(likes, (like) => like !== auth.id);
      } else {
        newLikes = [auth.id];
      }

      await MailBoxModel.updateOne({ _id: id }, { likes: newLikes });

      return res.status(StatusCodes.OK).json({
        status: true,
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

export default routes;
