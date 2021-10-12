import { useApp, useGasToUst } from '@libs/app-provider';
import { u, UST } from '@libs/types';

export function useFixedFee(): u<UST> {
  const { constants } = useApp();
  return useGasToUst(constants.fixedGas);
}
