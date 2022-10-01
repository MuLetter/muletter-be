import { getFeatures } from "@api";
import { AudioFeature, HasToken } from "@api/types";
import { euclideanDistance } from "../KMeans/utils";
import MinMaxScaler from "../MinMaxScaler";
import { Track } from "@models/types";
import Recommender from ".";
import _ from "lodash";
import mongoose from "mongoose";
import { NEED_FEATURES } from "./common";
import { ProcessAudioFeatures } from "./types";

export function parseNeedFeatures(feature: AudioFeature) {
  const processAudioFeaturs: ProcessAudioFeatures = {} as any;
  for (let parse of NEED_FEATURES) {
    (processAudioFeaturs as any)[parse] = feature[parse];
  }

  return processAudioFeaturs;
}

export class FeaturesGenerator {
  datas: Track[];

  constructor(datas: Track[]) {
    this.datas = datas;
  }

  async generate(hasToken: HasToken) {
    let features: ProcessAudioFeatures[] = [];

    const trackIds = _.uniq(_.map(this.datas, ({ id }) => id));
    const chunked = _.chunk(trackIds, 100);

    for (let chunk of chunked) {
      const ids = _.join(chunk, ",");

      const res = await getFeatures.call(hasToken, ids);
      const audioFeatures = res.data.audio_features;

      // 필요로 하는 것만 parsing
      const processAudioFeatures = _.map(audioFeatures, parseNeedFeatures);
      features = _.concat(features, processAudioFeatures);
    }

    return features;
  }
}

export function checkBuildItems(this: Recommender) {
  if (mongoose.connection.readyState !== 1)
    throw new Error("[step 1 required.] mongoose disconnected.");
  if (!this.spotifyToken || !this.mailBox || !this.availableGenres)
    throw new Error(
      "[step 2 required.] token, mailbox, availableGenres Empty!"
    );
  if (!this.artistAndGenres || !this.audioFeatures)
    throw new Error("[step 3 required.] artistAndGenres, audioFeatures Empty!");
  if (!this.seeds || !this.recommendations || !this.recoAudioFeatures)
    throw new Error(
      "[step 4 required.] seeds, recommendations, recoAudioFeatures Empty!"
    );
}

export function dropTrackByLabelCount(
  tracks: Track[],
  features: ProcessAudioFeatures[],
  idsAndLabels: (string | number | undefined)[][]
): Track[] {
  let [ids, labels] = _.unzip(idsAndLabels);
  let idsKeyLabels = _.zipObject(ids as string[], labels);

  tracks = _.map(tracks, (track) => ({
    ...track,
    label: idsKeyLabels[track.id] as number,
  }));

  let labelCounts: any = _.countBy(tracks, ({ label }) => label);
  labelCounts = _.toPairs(labelCounts);
  // console.log(labelCounts);

  const maxCountLabel = parseInt(
    _.maxBy(labelCounts, ([label, count]) => count) as string[][0]
  );

  const targetRecoIds = _.unzip(
    _.filter(idsAndLabels, ([, label]) => label === maxCountLabel)
  )[0];
  const targetFeatureObjs = _.filter(features, ({ id }) =>
    targetRecoIds.includes(id)
  );
  const targetIds = _.map(targetFeatureObjs, (feature) => _.values(feature)[0]);
  const targetFeatures = _.map(targetFeatureObjs, (feature) =>
    _.tail(_.values(feature))
  );
  const scaler = new MinMaxScaler(targetFeatures as number[][]);
  const targetScaling = scaler.fit().transfrom();
  const targetMeanDistance = _.map(targetScaling, (a) =>
    _.mean(_.map(targetScaling, (b) => euclideanDistance(a, b)))
  );

  const targetIdsAndMeanDistance = _.zip(targetIds, targetMeanDistance);
  const dropTrackId = _.maxBy(
    targetIdsAndMeanDistance,
    ([, distance]) => distance
  )![0];

  return _.filter(tracks, ({ id }) => id !== dropTrackId);
}
