import { InputEntry } from '../validate-input';

export const validateWhitelistedStable = (symbol: string): InputEntry => [
  () => symbol === 'usd',
  `symbol ${symbol} is not whitelisted.`,
];
