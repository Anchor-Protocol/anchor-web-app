import React, { useMemo } from 'react';
import { useVotingPowerQuery } from 'queries';
import { AmountTitle } from './AmountTitle';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';
import { VStack } from '@libs/ui/Stack';
import { useMyGaugeVotingQuery } from 'queries/gov/useMyGaugeVotingQuery';
import { sum } from '@libs/big-math';

export const MyVotingPower = () => {
  const { data: availableVotingPower = 0 } = useVotingPowerQuery();
  const { data: myVotes = {} } = useMyGaugeVotingQuery();

  const usedVotingPower = useMemo(
    () => sum(...Object.values(myVotes).map((vote) => vote.amount)),
    [myVotes],
  );

  return (
    <VStack fullHeight gap={40}>
      <AmountTitle
        amount={availableVotingPower as u<Token<BigSource>>}
        title="AVAILABLE VOTING POWER"
        symbol={VEANC_SYMBOL}
      />
      <AmountTitle
        amount={usedVotingPower as u<Token<BigSource>>}
        title="USED VOTING POWER"
        symbol={VEANC_SYMBOL}
      />
    </VStack>
  );
};
