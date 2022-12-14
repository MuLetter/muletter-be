import { SpotifyToken, SpotifyUser } from "@api/types";
import { Schema } from "mongoose";

export interface AuthFromToken {
  id: string;
  username: string;
  nickname: string;
  profile?: string;
  spotifyToken?: SpotifyToken;
  spotifyProfile?: SpotifyUser;
  socketId?: string;
}
