import { MailBox } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";

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

export default routes;
