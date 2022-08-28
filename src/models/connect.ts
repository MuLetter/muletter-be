import { connect } from "mongoose";
import AuthModel from "./auth";
import { AdminOptions } from "./types";

export async function dbConnect({ dbDrop }: AdminOptions) {
  const { MONGO_HOST, MONGO_PORT, MONGO_APP } = process.env;
  const connectURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_APP}`;

  try {
    await connect(connectURL);
    console.log("[mongoose] connected :)");

    if (dbDrop) {
      await AuthModel.deleteMany();
    }
  } catch (err) {
    console.error("[mongoose] connect Error :(");
    console.error(err);
  }
}

export async function init(options: AdminOptions) {
  await dbConnect(options);
}
