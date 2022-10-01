import { Mail } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";

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

      return res.status(StatusCodes.OK).json(mail);
    } catch (err) {
      console.error(err);

      return next(err);
    }
  },
  []
);

export default routes;
