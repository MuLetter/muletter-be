import { generateRandomString } from "@utils";
import Express from "express";
import { StatusCodes } from "http-status-codes";
import qs from "qs";
import { ResGetSpotifyOAuth, SPOTIFY_OAUTH_QUERY_SET } from "./types";

const routes = Express.Router();

routes.get(
  "/spotify-oauth",
  (req: Express.Request, res: Express.Response<ResGetSpotifyOAuth>) => {
    const state = generateRandomString(16);
    const oauthUrl = process.env.SPOTIFY_OAUTH_URL;
    const query = qs.stringify(
      { ...SPOTIFY_OAUTH_QUERY_SET, state },
      { addQueryPrefix: true }
    );
    return res.status(StatusCodes.OK).json({
      url: oauthUrl + query,
    });
  }
);

export default routes;
