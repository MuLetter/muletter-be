import axios from "axios";
import qs from "qs";
import { SpotifyToken, SpotifyUser, SPOTIFY_TOKEN_BODY_SET } from "./types";
import dotenv from "dotenv";

dotenv.config();
const AUTHURL = process.env.SPOTIFY_AUTH_URL;
const APIURL = process.env.SPOTIFY_API_URL;

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
