import React from 'react';
import { useMyVotingPowerQuery } from 'queries';
import { AmountTitle } from './AmountTitle';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { Rate, Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import { VStack } from '@libs/ui/Stack';
import { useMyGaugeVotesQuery } from 'queries/gov/useMyGaugeVotesQuery';
import { veANC } from '@anchor-protocol/types';

export const MyVotingPower = () => {
  const { data: availableVotingPower = 0 } = useMyVotingPowerQuery();
  const { data: myVotes = { total: 0 as u<veANC<BigSource>> } } =
    useMyGaugeVotesQuery();

  const totalVotingPower = Big(myVotes.total).plus(availableVotingPower);

  const hasAvailableVotingPower = !Big(availableVotingPower).eq(0);
  const hasUsedVotingPower = !Big(myVotes.total).eq(0);

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
          amount={myVotes.total as u<Token<BigSource>>}
          title="USED VOTING POWER"
          symbol={VEANC_SYMBOL}
          rate={
            hasAvailableVotingPower
              ? (Big(myVotes.total).div(totalVotingPower) as Rate<BigSource>)
              : undefined
          }
        />
      )}
    </VStack>
  );
};
