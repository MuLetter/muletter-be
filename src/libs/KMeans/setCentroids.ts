import _ from "lodash";
import KMeans from ".";
import { getDistancePropotinal, getMaxLabel } from "./utils";

export function v1(this: KMeans) {
  const idxes = _.range(0, this.datas.length);
  const centroidIdxes = _.sampleSize(idxes, this.K);
  this.centroids = _.filter(
    this.datas,
    (v, i) => _.indexOf(centroidIdxes, i) !== -1
  );
}

export function v2(this: KMeans) {
  const idxes = _.range(0, this.datas.length);

  // first is random
  const ranIdx = _.sample(idxes);
  const centroids = [this.datas[ranIdx!]];

  // next set with distance propotinal
  while (centroids.length < this.K) {
    const disPropotinal = getDistancePropotinal(this.datas, centroids);
    const nextIdx = getMaxLabel(disPropotinal as number[]);
    centroids.push(this.datas[nextIdx]);
  }
  this.centroids = centroids;
}
