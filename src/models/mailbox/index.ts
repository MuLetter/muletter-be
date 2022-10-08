import { model, Schema } from "mongoose";
import { IMailbox } from "./types";

const MailBoxSchema = new Schema<IMailbox>(
  {
    title: { type: String, required: true },
    image: { type: String, required: false },
    tracks: [{ type: Schema.Types.Mixed, required: true }],

    authId: { type: Schema.Types.ObjectId, required: true },
    point: { type: Schema.Types.Mixed, required: false },
  },
  {
    collection: "MailBox",
    timestamps: true,
  }
);

export const MailBoxModel = model<IMailbox>("MailBox", MailBoxSchema);
