import { Track } from "@models/spotify/types";
import { ResponseError } from "@routes/error";
import { StatusCodes } from "http-status-codes";
import { Schema } from "mongoose";
import { MailBoxModel } from ".";
import { MailBoxesProjection } from "./projections";
import _ from "lodash";

export interface IPoint {
  x: number;
  y: number;
}

export interface IMailbox {
  readonly _id?: Schema.Types.ObjectId | string;
  title: string;
  image?: string;
  tracks: Track[];

  authId: Schema.Types.ObjectId | string;
  point?: IPoint;

  createdAt?: Date;
  updatedAt?: Date;
}

export class MailBox implements IMailbox {
  _id?: Schema.Types.ObjectId | string;

  title!: string;
  image?: string;

  tracks!: Track[];

  authId!: Schema.Types.ObjectId | string;
  point?: IPoint;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(document: IMailbox) {
    Object.assign(this, document);
  }

  async save() {
    const mailBox = await MailBoxModel.create(this);

    return new MailBox(mailBox.toObject());
  }

  async appendTracks(tracks: Track[]) {
    await MailBoxModel.updateOne(
      { _id: this._id! },
      { $addToSet: { tracks: { $each: tracks } } }
    );

    return await MailBox.get(this._id!);
  }

  async pullTrack(id: string) {
    await MailBoxModel.updateOne(
      {
        _id: this._id!,
      },
      {
        $pull: {
          tracks: {
            id,
          },
        },
      }
    );

    return await MailBox.get(this._id!);
  }

  static async get(id: Schema.Types.ObjectId | string, includeUse?: boolean) {
    let mailBox = await MailBoxModel.findById(id);

    if (!mailBox)
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        "존재하지 않는 우체통 입니다."
      );

    mailBox = mailBox.toObject();

    if (includeUse)
      mailBox.tracks = _.filter(
        mailBox.tracks,
        ({ isUse }: Track) => isUse
      ) as Track[];

    return new MailBox(mailBox);
  }

  static async getListByAuthId(authId: string) {
    return await MailBoxModel.find({ authId }, MailBoxesProjection, {
      sort: { updatedAt: -1 },
    });
  }

  static async count() {
    return await MailBoxModel.estimatedDocumentCount();
  }

  static async countByAuthId(id: string) {
    return await MailBoxModel.countDocuments({
      authId: id,
    });
  }

  async isUseUpdate() {
    const originalMailBox = await MailBoxModel.findById(this._id);

    await MailBoxModel.updateOne(
      { _id: this._id },
      {
        $set: {
          tracks: _.map(originalMailBox!.tracks, (track) => ({
            ...track,
            isUse: true,
          })),
        },
      }
    );
  }

  async appendMusic(track: Track) {
    await MailBoxModel.updateOne(
      {
        _id: this._id,
      },
      {
        $push: {
          tracks: track,
        },
      }
    );

    return await MailBoxModel.findById(this._id, { _id: 0, tracks: 1 });
  }
}
