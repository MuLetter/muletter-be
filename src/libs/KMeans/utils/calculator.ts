import _ from "lodash";

export function euclideanDistance(x: number[], y: number[]) {
  const zipDatas = _.zip(x, y);
  return Math.sqrt(
    _.sum(
      _.map(zipDatas, (z: [number, number]) => _.subtract.apply(null, z) ** 2)
    )
  );
}

export function getMinLabel(numbers: number[]) {
  let label = 0;
  let minValue = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (minValue > numbers[i]) {
      label = i;
      minValue = numbers[i];
    }
  }

  return label;
}

export function getMaxLabel(numbers: number[]) {
  let label = 0;
  let maxValue = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (maxValue < numbers[i]) {
      label = i;
      maxValue = numbers[i];
    }
  }

  return label;
}

export function getDistancePropotinal(X: number[][], Y: number[][]) {
  return _.map(X, (x) => _.min(_.map(Y, (y) => euclideanDistance(x, y))));
}
