import { RecommenderRun } from "@lib";
import Express from "express";
import { StatusCodes } from "http-status-codes";

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

      return res.status(StatusCodes.ACCEPTED).json({
        message: "thx",
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

export default routes;
