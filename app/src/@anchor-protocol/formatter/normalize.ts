import { u } from '@libs/types';
import { demicrofy } from './demicrofy';
import { microfy } from './microfy';

export const normalize = <T>(
  amount: u<T>,
  fromDecimals: number,
  toDecimals: number,
): u<T> => {
  return microfy(demicrofy(amount, fromDecimals), toDecimals);
};
