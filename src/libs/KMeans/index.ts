import _ from "lodash";
import { clusterSeparation, sumOfSqaured } from "./calculator";
import { v1, v2 } from "./setCentroids";
import { euclideanDistance, getMinLabel } from "./utils";

class KMeans {
  datas: number[][];
  K: number;

  colors?: string[];

  // run datas
  labels?: number[];
  centroids?: number[][];
  done?: boolean;
  algType?: string;
  earlyStop: number;

  constructor(datas: number[][], earlyStop = 3) {
    this.datas = datas;
    this.K = Math.round(Math.sqrt(datas.length / 2));
    this.earlyStop = earlyStop;
  }

  setCentroids(version: number) {
    // version 1. KMeans
    // version 2. KMeans++
    const minVersion = 1;
    const maxVersion = 2;
    switch (version) {
      case 1:
        this.algType = "kmeans";
        v1.call(this);
        break;
      case 2:
        this.algType = "kmeans-plus";
        v2.call(this);
        break;
      default:
        throw new Error(
          `Version.${version} not suported. Min Version.${minVersion}, Max Version.${maxVersion}`
        );
    }

    this.done = false;
    this.labels = _.fill(new Array(this.datas.length), 0);
  }

  next() {
    this.labels = _.map(this.datas, (x) =>
      getMinLabel(
        _.map(this.centroids, (centroid) => euclideanDistance(x, centroid))
      )
    );

    const newCentroids = new Array(this.K);
    for (let label of _.uniq(this.labels)) {
      const members = _.filter(this.datas, (d, i) => this.labels![i] === label);
      const zipDatas = _.zip.apply(null, members);

      newCentroids[label] = _.map(zipDatas, (z) => _.mean(z));
    }

    if (_.isEqual(this.centroids, newCentroids)) this.earlyStop--;
    this.centroids = newCentroids;

    if (this.earlyStop === 0) this.done = true;
  }

  get clusterSeparation() {
    return clusterSeparation.call(this);
  }

  get tss() {
    return sumOfSqaured(this.datas);
  }
  get wss() {
    let wss = 0;
    for (let label of _.uniq(this.labels)) {
      const filtered = _.filter(
        this.datas,
        (data, idx) => this.labels![idx] === label
      );
      const sse = sumOfSqaured(filtered);
      wss += sse;
    }

    return wss;
  }

  get ecv() {
    return (1 - this.wss / this.tss) * 100;
  }
}

export default KMeans;
