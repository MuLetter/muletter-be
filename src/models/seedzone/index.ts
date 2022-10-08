import { model, Schema } from "mongoose";
import { ISeedZone } from "./types";

const SeedZoneSchema = new Schema<ISeedZone>(
  {
    id: { type: String, required: true },
    danceability: { type: Number, required: true },
    energy: { type: Number, required: true },
    loudness: { type: Number, required: true },
    speechiness: { type: Number, required: true },
    acousticness: { type: Number, required: true },
    liveness: { type: Number, required: true },
    valence: { type: Number, required: true },
    tempo: { type: Number, required: true },
    label: { type: Number, required: false },
  },
  {
    collection: "SeedZone",
  }
);

export const SeedZoneModel = model<typeof SeedZoneSchema>(
  "SeedZone",
  SeedZoneSchema
);
