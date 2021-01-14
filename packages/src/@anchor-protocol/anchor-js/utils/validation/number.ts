import { Dec, Int } from '@terra-money/terra.js';
import { InputEntry } from '../validate-input';

export const validateIsNumber = (n: number | string): InputEntry => [
  () => !new Dec(n).isNaN(),
  `invalid number ${n}`,
];

export const validateIsGreaterThanZero = (n: number | string): InputEntry => [
  () => new Dec(n).greaterThan(0),
  `number should be > 0.`,
];

export const validateIsStringPrecision = (n: string): InputEntry => [
  () => !new Int(n).isNaN() && n.toString().split('.').length === 2,
  `number should be in precision format: ${n}.`,
];
