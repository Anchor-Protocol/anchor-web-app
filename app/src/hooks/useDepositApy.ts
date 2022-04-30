import { computeApy } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { useMemo } from 'react';

export const useDepositApy = () => {
  const { constants } = useAnchorWebapp();
  const { data: { overseerEpochState } = {} } = useEarnEpochStatesQuery();

  return useMemo(() => {
    return computeApy(
      overseerEpochState?.deposit_rate,
      constants.blocksPerYear,
    );
  }, [constants.blocksPerYear, overseerEpochState]);
};
