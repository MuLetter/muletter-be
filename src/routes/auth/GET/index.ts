import { Auth } from "@models/types";
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
    const token = req.headers["authorization"];
    console.log("사용자 token", token);

    try {
      const auth = await Auth.tokenCheck(token);
      console.log("decrypted jwt", auth);

      return res.status(StatusCodes.OK).json(auth.toPlainObject());
    } catch (err) {
      return next(err);
    }
  }
);

export default routes;
