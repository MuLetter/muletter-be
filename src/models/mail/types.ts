import { Track } from "@models/types";
import { Schema, Types } from "mongoose";
import { MailModel } from ".";

export interface IMail {
  _id?: Schema.Types.ObjectId | string;
  title: string;
  tracks: Track[];
  createdAt?: Date;
  updatedAt?: Date;

  mailBoxId?: Schema.Types.ObjectId | string;
}

export class Mail implements IMail {
  _id?: Schema.Types.ObjectId | string;
  title: string;
  tracks: Track[];
  createdAt?: Date;
  updatedAt?: Date;

  mailBoxId?: Schema.Types.ObjectId | string;

  constructor(
    title: string,
    tracks: Track[],
    mailBoxId?: Schema.Types.ObjectId | string
  ) {
    this.title = title;
    this.tracks = tracks;
    this.mailBoxId = mailBoxId;
  }

  static getFromDocs(mail: IMail) {
    return new Mail(mail.title, mail.tracks, mail.mailBoxId);
  }

  static async getListByMailBoxId(id: string) {
    return await MailModel.aggregate([
      { $match: { mailBoxId: new Types.ObjectId(id) } },
      {
        $project: {
          _id: 1,
          title: 1,
          tracks: { $slice: ["$tracks", 5] },
          size: { $size: "$tracks" },
        },
      },
    ]);
  }
}
