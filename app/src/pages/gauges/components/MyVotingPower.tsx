import React, { useMemo } from 'react';
import { useMyVotingPowerQuery } from 'queries';
import { AmountTitle } from './AmountTitle';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { Rate, Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { VStack } from '@libs/ui/Stack';
import { useMyGaugeVotesQuery } from 'queries/gov/useMyGaugeVotesQuery';
import { sum } from '@libs/big-math';

export const MyVotingPower = () => {
  const { data: availableVotingPower = 0 } = useMyVotingPowerQuery();
  const { data: myVotes = [] } = useMyGaugeVotesQuery();

  const usedVotingPower = useMemo(
    () => sum(...myVotes.map((vote) => vote.amount)),
    [myVotes],
  );

  const totalVotingPower = Big(usedVotingPower).plus(availableVotingPower);

  const hasAvailableVotingPower = !Big(availableVotingPower).eq(0);
  const hasUsedVotingPower = !Big(usedVotingPower).eq(0);

  return (
    <VStack fullHeight gap={40}>
      <AmountTitle
        amount={availableVotingPower as u<Token<BigSource>>}
        title="AVAILABLE VOTING POWER"
        symbol={VEANC_SYMBOL}
        rate={
          hasAvailableVotingPower && hasUsedVotingPower
            ? (Big(availableVotingPower).div(
                totalVotingPower,
              ) as Rate<BigSource>)
            : undefined
        }
      />
      {hasUsedVotingPower && (
        <AmountTitle
          amount={usedVotingPower as u<Token<BigSource>>}
          title="USED VOTING POWER"
          symbol={VEANC_SYMBOL}
          rate={
            hasAvailableVotingPower
              ? (Big(usedVotingPower).div(totalVotingPower) as Rate<BigSource>)
              : undefined
          }
        />
      )}
    </VStack>
  );
};
