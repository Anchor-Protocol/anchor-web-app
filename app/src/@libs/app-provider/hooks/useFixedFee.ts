import { computeGasToUst } from '@anchor-protocol/app-fns';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useApp } from '@libs/app-provider';
import { u, UST } from '@libs/types';

export function useFixedFee(): u<UST> {
  const {
    target: { isNative },
  } = useDeploymentTarget();
  const { constants, gasPrice } = useApp();

  if (isNative) {
    return computeGasToUst(gasPrice, constants.fixedGas);
  }

  return '0' as u<UST>;
}
