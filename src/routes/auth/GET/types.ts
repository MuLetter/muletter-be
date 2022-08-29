import { Schema } from "mongoose";

export interface AuthFromToken {
  id: Schema.Types.ObjectId | string;
  username: string;
  nickname: string;
}
