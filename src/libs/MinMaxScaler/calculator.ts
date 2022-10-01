import _ from "lodash";

export function arraySum(X: (number | undefined)[], Y: (number | undefined)[]) {
  return _.map(X, (x, XIdx) => x! + Y[XIdx]!);
}

export function arraySubtract(
  X: (number | undefined)[],
  Y: (number | undefined)[]
) {
  return _.map(X, (x, XIdx) => _.subtract(x!, Y[XIdx]!));
}

export function arrayDivide(
  X: (number | undefined)[],
  Y: (number | undefined)[]
) {
  return _.map(X, (x, XIdx) => _.divide(x!, Y[XIdx]!));
}

export function arrayMultiply(
  X: (number | undefined)[],
  Y: (number | undefined)[]
) {
  return _.map(X, (x, XIdx) => _.multiply(x!, Y[XIdx]!));
}
