import { getTokenByClientCredentials, getUserMe } from "@api";
import { loginCheck } from "@middlewares";
import { Auth, Mail, MailBox } from "@models/types";
import { AxiosError } from "axios";
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
      } else {
        // authorization code의 spotify token이 존재하는 것
        console.log("/auth", auth.spotifyToken);
        try {
          const res = await getUserMe(auth.spotifyToken.access_token);
          auth.spotifyProfile = res.data;
        } catch (err: any) {
          if (err.response.status === 401) {
            auth.spotifyToken = await (
              await getTokenByClientCredentials()
            ).data;
            auth.spotifyToken.isExpires = true;
          }
        }
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
