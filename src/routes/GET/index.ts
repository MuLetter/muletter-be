import { OAuthMemoryModel } from "@models";
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

// Client-Side 백업데이터 저장용
routes.post(
  "/spotify-oauth/:state",
  async (req: Express.Request, res: Express.Response) => {
    const { state } = req.params;
    const oauthMemory = await OAuthMemory.get(state);
    await oauthMemory.save(req.body);

    return res.status(StatusCodes.OK).json({
      memory: _.toPlainObject(oauthMemory),
    });
  }
);

export default routes;
