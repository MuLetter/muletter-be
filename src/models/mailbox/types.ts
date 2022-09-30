import { Track } from "@models/spotify/types";
import { AuthFromToken } from "@routes/auth/types";
import { ResponseError } from "@routes/error";
import { StatusCodes } from "http-status-codes";
import { Schema } from "mongoose";
import { MailBoxModel } from ".";
import { MailBoxesProjection } from "./projections";
import _ from "lodash";

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
  _id?: Schema.Types.ObjectId | string;

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
    _id?: Schema.Types.ObjectId | string,
    tracks?: Track[]
  ) {
    this.authId = typeof auth === "string" ? auth : auth.id;
    this.title = title;
    this.image = image;
    this.tracks = tracks ? tracks : [];
    this._id = _id;
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

  async appendTracks(tracks: Track[]) {
    await MailBoxModel.updateOne(
      { _id: this._id! },
      { $addToSet: { tracks: { $each: tracks } } }
    );

    return await MailBox.get(this._id!);
  }

  static async get(id: Schema.Types.ObjectId | string) {
    const mailBox = await MailBoxModel.findById(id);

    if (!mailBox)
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        "존재하지 않는 우체통 입니다."
      );

    return new MailBox(
      mailBox.authId.toString(),
      mailBox.title,
      mailBox.image,
      mailBox._id.toString(),
      mailBox.tracks
    );
  }

  static async getListByAuthId(authId: string) {
    return await MailBoxModel.find({ authId }, MailBoxesProjection, {
      sort: { updatedAt: -1 },
    });
  }
}
