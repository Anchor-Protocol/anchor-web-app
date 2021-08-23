import { Gas } from '@libs/types';
import { GasPrice } from '@libs/webapp-fns';
import big, { BigSource } from 'big.js';
import { useMemo } from 'react';
import { useTerraWebapp } from '../contexts/context';

export function useGasPrice<Denom extends keyof GasPrice>(
  gas: Gas<BigSource>,
  denom: Denom,
): GasPrice[Denom] {
  const { gasPrice } = useTerraWebapp();

  return useMemo(() => {
    return big(gas).mul(gasPrice[denom]).toFixed() as GasPrice[Denom];
  }, [denom, gas, gasPrice]);
}
