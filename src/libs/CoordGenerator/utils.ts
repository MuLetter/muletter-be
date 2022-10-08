import _ from "lodash";

export function getCountPercentage(
  K: number,
  labelCounts: { [key: string]: number }
) {
  const counts = _.fill(Array(K), 0);

  _.forIn(labelCounts, (v, k) => {
    counts[parseInt(k)] = v;
  });

  const totalCount = _.sum(counts);
  const countPercentages = _.map(counts, (count) => (count / totalCount) * 100);

  return countPercentages;
}

const QUADRANT_CHECK = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
const CHK_ANGLE = [0, 90, 180, 270];
export function getQuadrant(angle: number) {
  if (CHK_ANGLE.includes(angle)) return -1;
  else {
    if (angle < 90) return 0;
    else if (angle < 180) return 1;
    else if (angle < 270) return 2;
    else if (angle < 360) return 3;
  }
}
export function checkQuadrant(angle: number, distance: number) {
  if (angle === 0) return [0, distance];
  else if (angle === 90) return [distance, 0];
  else if (angle === 180) return [0, distance * -1];
  else if (angle === 270) return [distance * -1, 0];
}
export function getCoord(datas: number[]) {
  const length = datas.length;
  const angles = _.map(_.range(0, length), (x) => (x / length) * (2 * Math.PI));
  // console.log(angles);

  // get non-zero
  const X = _.filter(angles, (a, idx) => datas[idx] !== 0);
  const Y = _.filter(datas, (d) => d !== 0);
  // console.log(X, Y);

  const points = _.zip(X, Y);
  // console.log(points);

  const _points = _.map(points, ([x, y]) => {
    const radian: number = x!;
    const angle = (radian / Math.PI) * 180;

    const distance: number = y!;
    const quadrant = getQuadrant(angle);

    if (quadrant === -1) return checkQuadrant(angle, distance);
    else {
      let ang = 0;
      if (angle < 90 || (angle > 180 && angle < 270)) ang = 90 - (angle % 90);
      else ang = ang % 90;
      const rad = (ang * Math.PI) / 180;
      const quad = QUADRANT_CHECK[quadrant!];

      return [
        distance * Math.cos(rad) * quad[0],
        distance * Math.sin(rad) * quad[1],
      ];
    }
  });
  // console.log(_points);

  const unZipDatas = _.unzip(_points as number[][]);
  return _.map(unZipDatas, _.sum);
}
