import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorBank,
  useAnchorWebapp,
  useBAssetClaimableRewardsTotalQuery,
  useBAssetClaimTx,
  useBLunaClaimableRewards,
} from '@anchor-protocol/app-provider';
import { useFixedFee } from '@libs/app-provider';
import { formatUTokenDecimal2 } from '@libs/formatter';
import { HumanAddr, u, UST } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { fixHMR } from 'fix-hmr';
import { claimableRewards as _claimableRewards } from 'pages/bond/logics/claimableRewards';
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
      <div className={className}>
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
      </div>
    );
  }

  return (
    <div className={className}>
      {!!invalidTxFee && claimableRewards.gt(0) && (
        <MessageBox>{invalidTxFee}</MessageBox>
      )}

      <ul>
        <li>Claimable rewards: {formatUTokenDecimal2(claimableRewards)} UST</li>
        {estimatedAmount && (
          <li>Estimated amount: {formatUTokenDecimal2(estimatedAmount)} UST</li>
        )}
        <li>Tx Fee: {formatUTokenDecimal2(fixedFee)} UST</li>
      </ul>

      <button
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
      </button>
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BAssetClaim = fixHMR(StyledComponent);
