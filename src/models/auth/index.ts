import { model, Schema } from "mongoose";
import { IAuth, IOAuthMemory } from "./types";

const AuthSchema = new Schema<IAuth>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    profile: { type: String },
    spotifyToken: { type: Schema.Types.Mixed },
    socketId: { type: String },
  },
  {
    collection: "Auth",
    timestamps: true,
  }
);
export const AuthModel = model<IAuth>("Auth", AuthSchema);

const OAuthMemorySchema = new Schema<IOAuthMemory>(
  {
    state: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
  },
  {
    collection: "OAuthMemory",
    timestamps: true,
  }
);
export const OAuthMemoryModel = model<IOAuthMemory>(
  "OAuthMemory",
  OAuthMemorySchema
);
