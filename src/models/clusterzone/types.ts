import KMeans from "@lib/KMeans";
import MinMaxScaler from "@lib/MinMaxScaler";
import { Schema } from "mongoose";
import { ClusterZoneModel } from ".";

export interface IScalerMemory {
  min: number[];
  max: number[];
  minMaxSubtract: number[];
}

export interface IClusterZone {
  _id?: Schema.Types.ObjectId | string;
  K: number;
  scaler: IScalerMemory;
  centroids: number[][];

  createdAt?: Date;
  updatedAt?: Date;
}

export class ClusterZone {
  scaler: MinMaxScaler;
  kmeans: KMeans;

  constructor(clusterZone: IClusterZone) {
    this.scaler = new MinMaxScaler([]);
    const { min, max, minMaxSubtract } = clusterZone.scaler;
    this.scaler.min = min;
    this.scaler.max = max;
    this.scaler.minMaxSubtract = minMaxSubtract;

    this.kmeans = new KMeans([]);
    const { K, centroids } = clusterZone;
    this.kmeans.K = K;
    this.kmeans.centroids = centroids;
  }

  transform(datas: number[][]) {
    const norms = this.scaler.transfrom(datas);

    return this.kmeans.transform(norms);
  }

  static async recovery() {
    const docs = await ClusterZoneModel.find(
      {},
      {},
      { sort: { createdAt: -1 } }
    );
    if (docs.length === 0) return null;
    const doc = docs[0];

    return new ClusterZone(doc);
  }

  static async save(kmeans: KMeans, scaler: MinMaxScaler) {
    const K = kmeans.K!;
    const [min, max, minMaxSubtract] = [
      scaler.min,
      scaler.max,
      scaler.minMaxSubtract,
    ];
    const centroids = kmeans.centroids!;

    await ClusterZoneModel.create({
      K,
      scaler: {
        min,
        max,
        minMaxSubtract,
      },
      centroids,
    });
  }
}
