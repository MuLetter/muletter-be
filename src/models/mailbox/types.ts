import { Track } from "@models/spotify/types";
import { ResponseError } from "@routes/error";
import { StatusCodes } from "http-status-codes";
import { Schema } from "mongoose";
import { MailBoxModel } from ".";
import { MailBoxesProjection } from "./projections";
import _ from "lodash";
import { Auth, Mail } from "@models/types";

export type MailBoxStatus =
  | "CREATE"
  | "APPEND"
  | "SPOTIFY INIT"
  | "PROCESSING"
  | "ERROR"
  | "SUCCESS";

export interface IPoint {
  x: number;
  y: number;
}

export interface IMailbox {
  readonly _id?: Schema.Types.ObjectId | string;
  title: string;
  image?: string;
  tracks: Track[];
  status: MailBoxStatus;

  authId: Schema.Types.ObjectId | string;
  point?: IPoint;
  likes?: string[];

  createdAt?: Date;
  updatedAt?: Date;

  // Class 용
  mailCount?: number;
  likeCount?: number;
  isLike?: boolean;
  user?: Auth;
}

export class MailBox implements IMailbox {
  _id?: Schema.Types.ObjectId | string;

  title!: string;
  image?: string;
  likes?: string[];

  tracks!: Track[];

  authId!: Schema.Types.ObjectId | string;
  point?: IPoint;
  status!: MailBoxStatus;

  createdAt!: Date;
  updatedAt!: Date;

  likeCount?: number;
  mailCount?: number;
  isLike?: boolean;
  user?: Auth;

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
      { $addToSet: { tracks: { $each: tracks } }, $set: { status: "APPEND" } }
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

  static async get(
    id: Schema.Types.ObjectId | string,
    options?: QueryMailboxOption
  ) {
    let mailBox = await MailBoxModel.findById(id);

    if (!mailBox)
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        "존재하지 않는 우체통 입니다."
      );

    mailBox = mailBox.toObject();

    if (options) {
      if (options.includeUse) {
        mailBox.tracks = _.filter(
          mailBox.tracks,
          ({ isUse }: Track) => isUse
        ) as Track[];
      }
      if (options.likeCheck) {
        if (!mailBox.likes) mailBox.isLike = false;
        else {
          mailBox.isLike = _.includes(mailBox.likes, options.likeCheck);
        }
      }
    }

    return new MailBox(mailBox);
  }

  static async getAll(options?: QueryMailboxOption): Promise<IMailbox[]> {
    const _mailBoxes = await MailBoxModel.find(
      {},
      { _v: 0, createdAt: 0, updatedAt: 0 }
    );
    const mailBoxes: IMailbox[] = await Promise.all(
      _.map(_mailBoxes, async (_mailBox) => {
        const user = await Auth.getSimple(_mailBox.authId);
        const mailes = await Mail.getListByMailBoxId(_mailBox._id.toString());
        const mb = {
          ..._mailBox.toObject(),
          mailCount: mailes.length,
          likeCount: _mailBox.likes ? _mailBox.likes.length : 0,
          user,
        } as IMailbox;

        if (options)
          if (options.likeCheck)
            mb.isLike = _mailBox.likes
              ? _.includes(_mailBox.likes, options.likeCheck)
              : false;

        return mb;
      })
    );

    return mailBoxes;
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

export interface QueryMailboxOption {
  includeUse?: boolean;
  likeCheck?: string;
}
