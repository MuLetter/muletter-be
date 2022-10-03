import { Auth } from "@models/types";
import Express from "express";
import { ReqJoinBody, ReqLoginBody } from "./types";
import { StatusCodes } from "http-status-codes";

const routes = Express.Router();

routes.post(
  "/",
  async (
    req: Express.Request<any, any, ReqLoginBody>,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    try {
      const { username, password } = req.body;

      const auth = await Auth.login(username, password);

      return res.status(StatusCodes.CREATED).json({
        token: auth.token,
      });
    } catch (err) {
      return next(err);
    }
  }
);

routes.post(
  "/join",
  async (
    req: Express.Request<any, any, ReqJoinBody>,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { username, password, nickname, spotifyToken } = req.body;

    try {
      const auth = await Auth.check(username, password, nickname);

      if (spotifyToken) auth.spotifyToken = spotifyToken;

      await auth.save();
      const loginTest = await Auth.login(username, password);

      console.log("로그인 정보", loginTest);
      console.log("반환 토큰", loginTest.token);

      return res.status(StatusCodes.CREATED).json({
        token: loginTest.token,
      });
    } catch (err) {
      return next(err);
    }
  }
);

export default routes;
