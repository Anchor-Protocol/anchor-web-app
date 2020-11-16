import BN from "bignumber.js"
import { isNil } from "ramda"

export const plus = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).plus(b || 0).toString()

export const minus = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).minus(b || 0).toString()

export const times = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).times(b || 0).toString()

export const div = (a?: BN.Value, b?: BN.Value): string =>
  new BN(a || 0).div(b || 1).toString()

export const sum = (array: BN.Value[]): string =>
  BN.sum.apply(null, array.filter(isFinite)).toString()

export const min = (array: BN.Value[]): string =>
  BN.min.apply(null, array.filter(isFinite)).toString()

export const max = (array: BN.Value[]): string =>
  BN.max.apply(null, array.filter(isFinite)).toString()

export const ceil = (n: BN.Value): string =>
  new BN(n).integerValue(BN.ROUND_CEIL).toString()

export const floor = (n: BN.Value): string =>
  new BN(n).integerValue(BN.ROUND_FLOOR).toString()

export const abs = (n: BN.Value): string => new BN(n).abs().toString()

/* format */
export const number = (n: BN.Value): number => new BN(n).toNumber()

/* boolean */
export const gt = (a: BN.Value, b: BN.Value): boolean => new BN(a).gt(b)
export const lt = (a: BN.Value, b: BN.Value): boolean => new BN(a).lt(b)
export const gte = (a: BN.Value, b: BN.Value): boolean => new BN(a).gte(b)
export const lte = (a: BN.Value, b: BN.Value): boolean => new BN(a).lte(b)

export const isFinite = (n?: BN.Value): boolean =>
  !isNil(n) && new BN(n).isFinite()

export const isInteger = (n?: BN.Value): boolean =>
  !isNil(n) && new BN(n).isInteger()