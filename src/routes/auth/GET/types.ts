import { SpotifyToken } from "@api/types";
import { Schema } from "mongoose";

export interface AuthFromToken {
  id: string;
  username: string;
  nickname: string;
  spotifyToken?: SpotifyToken;
  socketId?: string;
}
