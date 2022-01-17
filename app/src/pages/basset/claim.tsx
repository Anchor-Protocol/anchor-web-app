import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorBank,
  useAnchorWebapp,
  useBAssetClaimableRewardsTotalQuery,
  useBAssetClaimTx,
  useBLunaClaimableRewards,
} from '@anchor-protocol/app-provider';
import { formatUST } from '@anchor-protocol/notation';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { HumanAddr, u, UST } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { Sub } from 'components/Sub';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import { claimableRewards as _claimableRewards } from 'pages/basset/logics/claimableRewards';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

export interface BAssetClaimProps {
  className?: string;
}

function Component({ className }: BAssetClaimProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useBAssetClaimTx();

  const { contractAddress } = useAnchorWebapp();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useAnchorBank();

  const { data: { claimableReward, rewardState } = {} } =
    useBLunaClaimableRewards();

  const { data: { total, rewards } = {} } =
    useBAssetClaimableRewardsTotalQuery();

  //const {} = useAnchorWebapp()

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedFee),
    [connectedWallet, tokenBalances.uUST, fixedFee],
  );

  const claimableRewards = useMemo(
    () =>
      _claimableRewards(claimableReward, rewardState).plus(total ?? '0') as u<
        UST<Big>
      >,
    [claimableReward, rewardState, total],
  );

  const estimatedAmount = useMemo(() => {
    const amount = claimableRewards.minus(fixedFee) as u<UST<Big>>;
    return amount.gt(fixedFee) ? amount : undefined;
  }, [claimableRewards, fixedFee]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(() => {
    if (
      !connectedWallet ||
      !claim ||
      !claimableReward ||
      !rewardState ||
      !rewards
    ) {
      return;
    }

    const balanceExistsRewardsAddrs: HumanAddr[] = [];

    if (_claimableRewards(claimableReward, rewardState).gt(0)) {
      balanceExistsRewardsAddrs.push(contractAddress.bluna.reward);
    }

    for (const [rewardAddr, reward] of rewards) {
      if (big(reward.claimableReward.rewards).gt(0)) {
        balanceExistsRewardsAddrs.push(rewardAddr);
      }
    }

    if (balanceExistsRewardsAddrs.length === 0) {
      throw new Error('There is no rewards');
    }

    claim({
      rewardAddrs: balanceExistsRewardsAddrs,
    });
  }, [
    claim,
    claimableReward,
    connectedWallet,
    contractAddress.bluna.reward,
    rewardState,
    rewards,
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === StreamStatus.IN_PROGRESS ||
    claimResult?.status === StreamStatus.DONE
  ) {
    return (
      <CenteredLayout className={className} maxWidth={720}>
        <Section>
          <TxResultRenderer
            resultRendering={claimResult.value}
            onExit={() => {
              switch (claimResult.status) {
                case StreamStatus.IN_PROGRESS:
                  claimResult.abort();
                  break;
                case StreamStatus.DONE:
                  claimResult.clear();
                  break;
              }
            }}
          />
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={720}>
      <Section>
        <h1>Claim Rewards</h1>

        {!!invalidTxFee && claimableRewards.gt(0) && (
          <MessageBox>{invalidTxFee}</MessageBox>
        )}

        <div className="amount">
          {formatUST(demicrofy(claimableRewards))} <Sub>UST</Sub>
        </div>

        <TxFeeList className="receipt">
          {estimatedAmount && (
            <TxFeeListItem label="Estimated Amount">
              {formatUST(demicrofy(estimatedAmount))} UST
            </TxFeeListItem>
          )}
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !claim ||
              !estimatedAmount ||
              !!invalidTxFee
            }
            onClick={proceed}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </Section>
    </CenteredLayout>
  );
}

export const Amount = styled.div`
  display: flex;
  justify-content: space-between;

  font-size: 18px;
  font-weight: 500;
`;

const StyledComponent = styled(Component)`
  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    font-size: 32px;
    font-weight: normal;
    text-align: center;

    sub {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .receipt {
    margin-top: 60px;
  }

  .proceed {
    margin-top: 40px;

    width: 100%;
    height: 60px;
  }
`;

export const BAssetClaim = fixHMR(StyledComponent);
