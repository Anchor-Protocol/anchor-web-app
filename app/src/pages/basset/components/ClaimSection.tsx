import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { demicrofy, formatUST } from '@anchor-protocol/notation';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { useClaimable } from 'pages/basset/queries/claimable';
import { claimOptions } from 'pages/basset/transactions/claimOptions';
import React, { useCallback, useEffect, useMemo } from 'react';
import { claimableRewards as _claimableRewards } from '../logics/claimableRewards';

export interface ClaimSectionProps {
  disabled: boolean;
  onProgress: (inProgress: boolean) => void;
}

export function ClaimSection({ disabled, onProgress }: ClaimSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const [claim, claimResult] = useOperation(claimOptions, {});

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: { rewardState, claimableReward },
  } = useClaimable();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const claimableRewards = useMemo(
    () =>
      _claimableRewards(
        claimableReward?.balance,
        rewardState?.global_index,
        claimableReward?.index,
        claimableReward?.pending_rewards,
      ),
    [
      claimableReward?.balance,
      claimableReward?.index,
      claimableReward?.pending_rewards,
      rewardState?.global_index,
    ],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    async (walletReady: WalletReady) => {
      await claim({
        address: walletReady.walletAddress,
        bAsset: 'bluna',
        recipient: undefined,
      });
    },
    [claim],
  );

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    onProgress(claimResult?.status === 'in-progress');
  }, [claimResult?.status, onProgress]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === 'in-progress' ||
    claimResult?.status === 'done' ||
    claimResult?.status === 'fault'
  ) {
    return (
      <Section>
        <TransactionRenderer result={claimResult} />
      </Section>
    );
  }

  return (
    <Section>
      <article className="claimable-rewards">
        <h4>
          <IconSpan>
            Claimable Rewards{' '}
            <InfoTooltip>
              Claim staking rewards from minted bAssets that have not been
              provided as collateral
            </InfoTooltip>
          </IconSpan>
        </h4>
        <p>
          {claimableRewards.gt(0)
            ? formatUST(demicrofy(claimableRewards)) + ' UST'
            : '-'}
        </p>
      </article>

      {!!invalidTxFee && big(claimableRewards).gt(0) && (
        <MessageBox>{invalidTxFee}</MessageBox>
      )}

      <ActionButton
        className="submit"
        disabled={
          !serviceAvailable ||
          !!invalidTxFee ||
          claimableRewards.lte(0) ||
          disabled
        }
        onClick={() => walletReady && proceed(walletReady)}
      >
        Claim
      </ActionButton>
    </Section>
  );
}
