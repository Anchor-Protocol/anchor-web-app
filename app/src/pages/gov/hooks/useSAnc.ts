import { useMemo } from 'react';
import { useVotingEscrowConfigQuery, useGovStateQuery } from 'queries';
import { ANC } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import Big, { BigSource } from 'big.js';
import { useAncTokenomics } from 'hooks';

export const useSAnc = () => {
  const { data: lockConfig } = useVotingEscrowConfigQuery();
  const { data: govState } = useGovStateQuery();
  const ancTokenomics = useAncTokenomics();

  const convertAncToSAnc = useMemo(() => {
    if (!lockConfig || !govState || !ancTokenomics) {
      return undefined;
    }

    return (amount: ANC<BigSource>): ANC<Big> => {
      const totalShare = demicrofy(govState.total_share);
      const totalStaked = demicrofy(ancTokenomics.totalStaked);

      return Big(amount).mul(totalShare).div(totalStaked) as ANC<Big>;
    };
  }, [ancTokenomics, govState, lockConfig]);

  return {
    convertAncToSAnc,
  } as const;
};
