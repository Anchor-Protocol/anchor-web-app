import { veANC } from '@anchor-protocol/types';
import Big, { BigSource } from 'big.js';
import { useMyVotingPowerQuery } from 'queries';
import { useMemo } from 'react';
import { useMyGaugeVotesQuery } from './useMyGaugeVotesQuery';
import { u } from '@libs/types';

export const useMyAvailableVotingPowerQuery = () => {
  const { data: myVotingPower } = useMyVotingPowerQuery();
  const { data: myVotes } = useMyGaugeVotesQuery();

  const data = useMemo(() => {
    if (myVotingPower === undefined || myVotes === undefined) {
      return undefined;
    }

    return Big(myVotingPower).minus(myVotes.total) as u<veANC<BigSource>>;
  }, [myVotes, myVotingPower]);

  return {
    data,
  };
};
