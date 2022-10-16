import { MailBoxModel } from "@models";
import { Auth } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const routes = Express.Router();

routes.get("/", async (req: Express.Request, res: Express.Response) => {
  const mailBoxes = await MailBoxModel.find({}, { image: 1, point: 1, _id: 1 });

  return res.status(StatusCodes.OK).json(mailBoxes);
});

routes.get(
  "/mailbox",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const _mailBoxes = await MailBoxModel.find(
        {},
        { _v: 0, createdAt: 0, updatedAt: 0 }
      );
      const mailBoxes = await Promise.all(
        _.map(_mailBoxes, async (_mailBox) => {
          const user = await Auth.getSimple(_mailBox.authId);
          return {
            ..._mailBox.toObject(),
            user,
          };
        })
      );

      console.log(mailBoxes);

      return res.status(StatusCodes.OK).json(mailBoxes);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

export default routes;
