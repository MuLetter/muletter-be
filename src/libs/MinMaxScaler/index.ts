import _ from "lodash";
import {
  arrayDivide,
  arrayMultiply,
  arraySubtract,
  arraySum,
} from "./calculator";

class MinMaxScaler {
  datas: number[][];

  min?: (number | undefined)[];
  max?: (number | undefined)[];
  minMaxSubtract?: (number | undefined)[];

  constructor(datas: number[][]) {
    this.datas = datas;
  }

  fit() {
    const zipDatas = _.unzip(this.datas);

    this.min = _.map(zipDatas, (zipData) => _.min(zipData));
    this.max = _.map(zipDatas, (zipData) => _.max(zipData));
    this.minMaxSubtract = arraySubtract(this.max, this.min);

    return this;
  }

  transfrom(datas?: number[][]) {
    if (!this.minMaxSubtract) throw new Error("Pleash fit execute.");
    if (!datas) datas = this.datas;

    return _.map(datas, (X) =>
      arrayDivide(arraySubtract(X, this.min!), this.minMaxSubtract!)
    );
  }

  reverseTransform(datas: number[][]) {
    return _.map(datas, (X) =>
      arraySum(arrayMultiply(X, this.minMaxSubtract!), this.min!)
    );
  }
}

export default MinMaxScaler;
