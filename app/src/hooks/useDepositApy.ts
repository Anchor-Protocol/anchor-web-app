import { computeApy } from '@anchor-protocol/app-fns';
import {
  useAnchorWebapp,
  useEarnEpochStatesQuery,
} from '@anchor-protocol/app-provider';
import { useMemo } from 'react';

export const useDepositApy = () => {
  const { constants } = useAnchorWebapp();
  const { data: { overseerConfig, overseerEpochState } = {} } =
    useEarnEpochStatesQuery();

  return useMemo(() => {
    return computeApy(
      overseerEpochState?.deposit_rate,
      constants.blocksPerYear,
      overseerConfig?.epoch_period ?? 1,
    );
  }, [constants.blocksPerYear, overseerEpochState, overseerConfig]);
};
