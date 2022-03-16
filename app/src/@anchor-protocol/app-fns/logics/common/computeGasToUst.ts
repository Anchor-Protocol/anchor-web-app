import { GasPrice } from '@libs/app-fns';
import { Gas, u, UST } from '@libs/types';
import { BigSource } from 'big.js';
import { computeGasPrice } from './computeGasPrice';

export const computeGasToUst = (
  gasPrice: GasPrice,
  gas: Gas<BigSource>,
): u<UST> => {
  return computeGasPrice(gasPrice, gas, 'uusd') as u<UST>;
};
