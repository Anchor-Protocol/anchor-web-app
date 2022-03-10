import { computeGasPrice } from '@anchor-protocol/app-fns';
import { GasPrice } from '@libs/app-fns';
import { Gas, u, UST } from '@libs/types';
import { BigSource } from 'big.js';
import { useMemo } from 'react';
import { useApp } from '../contexts/app';

export function useGasPrice<Denom extends keyof GasPrice>(
  gas: Gas<BigSource>,
  denom: Denom,
): GasPrice[Denom] {
  const { gasPrice } = useApp();

  // pretty sure this shouldnt need to be memoized
  return useMemo(() => {
    return computeGasPrice(gasPrice, gas, denom) as GasPrice[Denom];
  }, [gas, denom, gasPrice]);
}

export function useGasToUst(gas: Gas<BigSource>): u<UST> {
  return useGasPrice(gas, 'uusd') as u<UST>;
}
