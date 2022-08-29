import { Track } from "@models/spotify/types";
import { AuthFromToken } from "@routes/auth/types";
import { Schema } from "mongoose";
import MailBoxModel from ".";

export interface IMailbox {
  readonly _id?: Schema.Types.ObjectId | string;
  title: string;
  image?: string;
  tracks: Track[];

  authId: Schema.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MailBox implements IMailbox {
  id?: Schema.Types.ObjectId | string;
  readonly _id!: Schema.Types.ObjectId | string;

  title: string;
  image?: string;

  tracks: Track[];

  authId: Schema.Types.ObjectId | string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    auth: AuthFromToken | string,
    title: string,
    image?: string,
    _id?: Schema.Types.ObjectId | string
  ) {
    this.authId = typeof auth === "string" ? auth : auth.id;
    this.title = title;
    this.image = image;
    this.tracks = [];
    this.id = _id;
  }

  async save() {
    const mailBox = await MailBoxModel.create(this);

    return new MailBox(
      mailBox.authId.toString(),
      mailBox.title,
      mailBox.image,
      mailBox._id.toString()
    );
  }
}
