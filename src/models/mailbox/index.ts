import { model, Schema } from "mongoose";
import { IMailbox } from "./types";

const MailBoxSchema = new Schema<IMailbox>(
  {
    title: { type: String, required: true },
    image: { type: String, required: false },
    tracks: [{ type: Schema.Types.Mixed, required: true }],

    authId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    collection: "MailBox",
    timestamps: true,
  }
);

const MailBoxModel = model<IMailbox>("MailBox", MailBoxSchema);
export default MailBoxModel;
