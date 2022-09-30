import { model, Schema } from "mongoose";
import { IMail } from "./types";

const MailSchema = new Schema<IMail>(
  {
    title: { type: String, required: true },
    tracks: [{ type: Schema.Types.Mixed, required: true }],
    mailBoxId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    collection: "Mail",
    timestamps: true,
  }
);

export const MailModel = model<IMail>("Mail", MailSchema);
