import { Auth, Mail, MailBox, OAuthMemory, UpdateAuth } from "@models/types";
import { generateRandomString } from "@utils";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import qs from "qs";
import { ResGetSpotifyOAuth, SPOTIFY_OAUTH_QUERY_SET } from "./types";
import _ from "lodash";
import { writeSuccessAlert } from "@utils/socket";
import { MailBoxModel } from "@models";
import { RecommenderRun } from "@lib";

const routes = Express.Router();

routes.get("/service", async (req: Express.Request, res: Express.Response) => {
  const mailBoxCount = await MailBox.count();
  const mailCount = await Mail.count();

  console.log(mailBoxCount);
  console.log(mailCount);

  return res.status(StatusCodes.OK).json({
    count: {
      mail: mailCount,
      mailBox: mailBoxCount,
    },
  });
});

routes.get(
  "/random-music",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { size } = req.query;

    try {
      const ranMail = await Mail.getSample();

      if (ranMail.length !== 0) {
        return res
          .status(StatusCodes.OK)
          .json(_.sampleSize(ranMail[0].tracks, parseInt(size as string)));
      } else {
        return res.status(StatusCodes.OK).json([]);
      }
    } catch (err) {
      console.error(err);

      return next(err);
    }
  }
);

routes.get(
  "/spotify-oauth",
  async (req: Express.Request, res: Express.Response<ResGetSpotifyOAuth>) => {
    const state = generateRandomString(16);
    const oauthUrl = process.env.SPOTIFY_OAUTH_URL;
    const query = qs.stringify(
      { ...SPOTIFY_OAUTH_QUERY_SET, state },
      { addQueryPrefix: true }
    );

    const oauthMemory = await OAuthMemory.create(state);

    return res.status(StatusCodes.CREATED).json({
      url: oauthUrl + query,
      memory: _.toPlainObject(oauthMemory),
    });
  }
);

routes.get(
  "/spotify-oauth/token",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { code, state } = req.query;

    try {
      const oauthMemory = await OAuthMemory.get(state as string);
      const path = oauthMemory.data.pathname;

      const token = await oauthMemory.getToken(code as string);
      const profile = await oauthMemory.getProfile(token.access_token);

      if (path !== "/auth/join") {
        const userToken = oauthMemory.data.userToken;
        const check = await Auth.tokenCheck(userToken);

        console.log("업데이트 전", check);
        const updateAuth: UpdateAuth = { spotifyToken: token };
        console.log("업데이트 후", await check.update(updateAuth));
      }

      return res.status(StatusCodes.OK).json({
        spotifyToken: token,
        spotifyProfile: profile,
        memory: _.toPlainObject(oauthMemory),
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

routes.get(
  "/okay/:id",
  async (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction
  ) => {
    const { id } = req.params;

    try {
      console.log(
        `[Server : Message] 우체통(${id})의 편지작성이 완료되었습니다.`
      );
      console.log("우체통 조회 --->");
      const mailBox = await MailBox.get(id);
      console.log(_.toPlainObject(mailBox));

      console.log("사용자 조회 --->");
      const auth = await Auth.getById(mailBox.authId);
      console.log(auth.toPlainObject());

      const socketId = auth.socketId;
      if (socketId)
        writeSuccessAlert(req, socketId, {
          message: "편지가 도착했습니다.",
          navigatePath: `/mailbox/${id}`,
        });

      return res.send("[From : BackEnd] Thx Recommender :)");
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

routes.get(
  "/error-retry",
  async (req: Express.Request, res: Express.Response) => {
    try {
      const errors = await MailBoxModel.find({ status: "ERROR" });

      _.forEach(errors, ({ _id }) => {
        RecommenderRun(_id.toString());
      });
    } catch (err) {}

    return res.send("okay");
  }
);

export default routes;
