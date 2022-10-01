import Recommender from ".";
import { IRecommederAdjust } from "./types";
import _ from "lodash";

// Decorater
function RecommenderAdjust<T extends { new (...args: any[]): Recommender }>(
  constructor: T
): new (...args: any[]) => IRecommederAdjust {
  return class extends constructor {
    constructor(...args: any[]) {
      super();
    }
    [Symbol.iterator]() {
      return this;
    }
    next() {
      this.run();
      if (
        this.recoTracks.length <= this.MAX_LENGTH &&
        this.recoTracks.length >= this.MIN_LENGTH
      ) {
        this.recoTracks = _.shuffle(this.recoTracks);
        return { value: this.recoTracks.length, done: true };
      } else return { value: this.recoTracks.length, done: false };
    }
  };
}

export default RecommenderAdjust;
