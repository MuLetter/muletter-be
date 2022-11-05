import { MailBoxModel } from "@models";
import { MailBox } from "@models/types";
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
