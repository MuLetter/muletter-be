import axios from "axios";
import qs from "qs";
import {
  HasToken,
  ResAudioFeatures,
  ResAvailableGenres,
  ResGetArtists,
  ResGetRecommendations,
  SpotifyToken,
  SpotifyUser,
  SPOTIFY_TOKEN_BODY_SET,
} from "./types";
import dotenv from "dotenv";
import { Seed } from "libs/types";

dotenv.config();
const AUTHURL = process.env.SPOTIFY_AUTH_URL;
const APIURL = process.env.SPOTIFY_API_URL;

export const getTokenByClientCredentials = async (isError?: boolean) =>
  await axios.post<SpotifyToken>(
    `${AUTHURL}`,
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.SPOTIFY_CLIENT_ID!,
        password: isError ? "1234" : process.env.SPOTIFY_CLIENT_SECRET!,
      },
    }
  );

export const getTokenByCode = async (code: string) =>
  await axios.post<SpotifyToken>(
    `${AUTHURL}`,
    qs.stringify({ code, ...SPOTIFY_TOKEN_BODY_SET }),
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.SPOTIFY_CLIENT_ID!,
        password: process.env.SPOTIFY_CLIENT_SECRET!,
      },
    }
  );

export const getUserMe = async (accessToken: string) =>
  await axios.get<SpotifyUser>(`${APIURL}/me`, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

export const getAvailableGenres = function (this: HasToken, isError?: boolean) {
  return axios.get<ResAvailableGenres>(
    `${APIURL}/recommendations/available-genre-seeds`,
    {
      headers: { authorization: isError ? "B" : `Bearer ${this.spotifyToken}` },
    }
  );
};

export const getArtists = function (
  this: HasToken,
  ids: string,
  isError?: boolean
) {
  return axios.get<ResGetArtists>(
    `${APIURL}/artists?${qs.stringify({ ids })}`,
    {
      headers: { authorization: isError ? "B" : `Bearer ${this.spotifyToken}` },
    }
  );
};

export const getFeatures = function (this: HasToken, ids: string) {
  return axios.get<ResAudioFeatures>(
    `${APIURL}/audio-features?${qs.stringify({ ids })}`,
    {
      headers: {
        authorization: `Bearer ${this.spotifyToken}`,
      },
    }
  );
};

export const getRecommendations = function (this: HasToken, seed: Seed) {
  return axios.get<ResGetRecommendations>(
    `${APIURL}/recommendations?${qs.stringify({
      ...seed,
      market: "KR",
      limit: 100,
    })}`,
    {
      headers: {
        authorization: `Bearer ${this.spotifyToken}`,
      },
    }
  );
};
