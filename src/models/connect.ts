import { connect } from "mongoose";
import {
  AuthModel,
  MailBoxModel,
  OAuthMemoryModel,
  MailModel,
  SeedZoneModel,
  ClusterZoneModel,
} from ".";
import { AdminOptions } from "./types";

export async function dbConnect({ dbDrop }: AdminOptions) {
  const { MONGO_HOST, MONGO_PORT, MONGO_APP } = process.env;
  const connectURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APP}`;

  try {
    await connect(connectURL);
    console.log("[mongoose] connected :)");

    if (dbDrop) {
      await AuthModel.deleteMany();
      await MailBoxModel.deleteMany();
      await OAuthMemoryModel.deleteMany();
      await MailModel.deleteMany();
      // await SeedZoneModel.deleteMany();
      // await ClusterZoneModel.deleteMany();
    }
  } catch (err) {
    console.error("[mongoose] connect Error :(");
    console.error(err);
  }
}

export async function init(options: AdminOptions) {
  await dbConnect(options);
}
