import { formatNumeric } from '@libs/formatter';
import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';

const ustFormatter = (amount: u<Token<BigSource>>): string => {
  return `${formatNumeric(amount)} UST`;
};

export { ustFormatter };
