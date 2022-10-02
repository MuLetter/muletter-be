import { getTokenByClientCredentials } from "@api";
import { loginCheck } from "@middlewares";
import { Auth, Mail, MailBox } from "@models/types";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

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

      if (!auth.spotifyToken) {
        auth.spotifyToken = await (await getTokenByClientCredentials()).data;
        console.log("injected spotifyToken", auth);
      }

      return res.status(StatusCodes.OK).json(auth.toPlainObject());
    } catch (err) {
      return next(err);
    }
  }
);

routes.get(
  "/info",
  loginCheck,
  async (req: Express.Request, res: Express.Response) => {
    const { id } = req.auth;

    const mailBoxes = await MailBox.getListByAuthId(id);
    const mailBoxIds = _.map(mailBoxes, ({ _id }) => _id.toString());

    const mailCount = await Mail.countByBoxId(mailBoxIds);

    return res.status(StatusCodes.OK).json({
      count: {
        mail: mailCount,
        mailBox: mailBoxIds.length,
      },
    });
  }
);

export default routes;
