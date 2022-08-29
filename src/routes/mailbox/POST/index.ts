import { loginCheck } from "@middlewares";
import Express from "express";

const routes = Express.Router();

routes.post(
  "/",
  loginCheck,
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    return res.send("test");
  }
);

export default routes;
