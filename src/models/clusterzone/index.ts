import { model, Schema } from "mongoose";
import { IClusterZone } from "./types";

const ClusterZoneSchema = new Schema<IClusterZone>(
  {
    K: { type: Number, required: true },
    scaler: { type: Schema.Types.Mixed, required: true },
    centroids: [{ type: Schema.Types.Array, required: true }],
  },
  {
    collection: "ClusterZone",
    timestamps: true,
  }
);

export const ClusterZoneModel = model<typeof ClusterZoneSchema>(
  "ClusterZone",
  ClusterZoneSchema
);
