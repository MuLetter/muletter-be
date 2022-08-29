import { Schema } from "mongoose";

export interface AuthFromToken {
  id: string;
  username: string;
  nickname: string;
}
