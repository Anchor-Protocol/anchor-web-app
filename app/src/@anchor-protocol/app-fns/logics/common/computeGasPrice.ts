import { GasPrice } from '@libs/app-fns';
import { floor } from '@libs/big-math';
import { Gas } from '@libs/types';
import big, { BigSource } from 'big.js';

type Denom = keyof GasPrice;

export const computeGasPrice = (
  gasPrice: GasPrice,
  gas: Gas<BigSource>,
  denom: Denom,
): GasPrice[Denom] => {
  return floor(big(gas).mul(gasPrice[denom])).toFixed() as GasPrice[Denom];
};
