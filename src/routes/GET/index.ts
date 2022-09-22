import { OAuthMemory } from "@models/types";
import { generateRandomString } from "@utils";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import qs from "qs";
import { ResGetSpotifyOAuth, SPOTIFY_OAUTH_QUERY_SET } from "./types";
import _ from "lodash";

const routes = Express.Router();

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
      const token = await oauthMemory.getToken(code as string);
      const profile = await oauthMemory.getProfile(token.access_token);

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

export default routes;
