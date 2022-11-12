import { MailBoxModel } from "@models";
import { MailBox } from "@models/types";
import mailbox from "@routes/mailbox";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const routes = Express.Router();

routes.get("/", async (req: Express.Request, res: Express.Response) => {
  const { id } = req.auth;
  const mailBoxes = await MailBoxModel.find(
    {},
    { image: 1, point: 1, _id: 1, authId: 1 }
  );
  const rtnMailBoxes = _.map(mailBoxes, (mailbox) => {
    const plain = mailbox.toObject();

    return { ...plain, isMe: id === plain.authId.toString() };
  });

  return res.status(StatusCodes.OK).json(rtnMailBoxes);
});

routes.get(
  "/mailbox",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { id } = req.auth;
    try {
      const mailBoxes = await MailBox.getAll({ likeCheck: id! });

      console.log(mailBoxes);

      return res.status(StatusCodes.OK).json(mailBoxes);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

export default routes;
