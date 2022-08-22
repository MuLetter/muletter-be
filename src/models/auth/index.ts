import { model, Schema } from "mongoose";
import { IAuth } from "./types";

const AuthSchema = new Schema<IAuth>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    profile: { type: String },
    spotifyToken: { type: String },
    socketId: { type: String },
  },
  {
    collection: "Auth",
    timestamps: true,
  }
);

const AuthModel = model<IAuth>("Auth", AuthSchema);
export default AuthModel;
