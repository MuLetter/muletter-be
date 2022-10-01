import KMeans from ".";
import _ from "lodash";
import { euclideanDistance } from "./utils";

// 높을 수록 좋은 거
export function clusterSeparation(this: KMeans) {
  const separations = _.map(this.centroids, (X, XIdx) => {
    const filtered = _.filter(this.centroids, (Y, YIdx) => XIdx !== YIdx);
    return _.map(filtered, (Y) => euclideanDistance(X, Y));
  });

  return _.mean(_.flatten(separations));
}

export function sumOfSqaured(datas: number[][]) {
  const dataMean = _.map(_.unzip(datas), (zipData) => _.mean(zipData));
  const dataMeanDistances = _.map(
    datas,
    (data) => euclideanDistance(dataMean, data) ** 2
  );

  return _.sum(dataMeanDistances);
}
