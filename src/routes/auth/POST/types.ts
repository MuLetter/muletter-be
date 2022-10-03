import { SpotifyToken } from "@api/types";

export interface Auth {
  username: string;
  password: string;
}
export interface ReqLoginBody extends Auth {}

export interface ReqJoinBody extends Auth {
  nickname: string;
  spotifyToken?: SpotifyToken;
}
