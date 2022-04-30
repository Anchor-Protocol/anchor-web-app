import { computeApr, computeApy } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { useMemo } from 'react';

export const useDepositApy = () => {
  const { constants } = useAnchorWebapp();
  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();

  return useMemo(() => {
    const apy = computeApy(
      overseerEpochState?.deposit_rate,
      constants.blocksPerYear,
    );

    if (apy.toNumber() >= 0.19) {
      return computeApr(overseerEpochState, constants.blocksPerYear);
    }

    return apy;
  }, [constants.blocksPerYear, overseerEpochState]);
};
