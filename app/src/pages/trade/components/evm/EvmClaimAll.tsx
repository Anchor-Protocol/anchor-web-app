import React from 'react';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { ClaimAll } from '../ClaimAll';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { ANC, u } from '@anchor-protocol/types';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { MINIMUM_CLAIM_BALANCE } from 'pages/trade/env';
import { useAccount } from 'contexts/account';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useClaimRewardsTx } from 'tx/evm/useClaimRewardsTx';
import { useRewardsClaimableUstBorrowRewardsQuery } from '@anchor-protocol/app-provider';
import big from 'big.js';

export const EvmClaimAll = () => {
  const { connected, availablePost } = useAccount();

  const {
    anc: { formatOutput, demicrofy, symbol },
  } = useFormatters();

  const { data: { borrowerInfo } = {} } =
    useRewardsClaimableUstBorrowRewardsQuery();

  const anc = borrowerInfo?.pending_rewards ?? ('0' as u<ANC>);

  const claimRewardsTx = useClaimRewardsTx();
  const [claimRewards, claimRewardsTxResult] = claimRewardsTx?.stream ?? [
    null,
    null,
  ];

  return (
    <ClaimAll txResult={claimRewardsTxResult}>
      <Section>
        <h1>Claim All Rewards</h1>
        <TxFeeList className="receipt">
          <TxFeeListItem label="Claiming">
            {formatOutput(demicrofy(anc))} {symbol}
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="button"
            disabled={
              !availablePost || !connected || big(anc).lt(MINIMUM_CLAIM_BALANCE)
            }
            onClick={() => claimRewards!({})}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </ClaimAll>
  );
};
