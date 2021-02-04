import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { demicrofy, formatUST } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import big from 'big.js';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useNetConstants } from 'contexts/net-contants';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import { useClaimableRewards } from 'pages/basset/logics/useClaimableRewards';
import { useClaimable } from 'pages/basset/queries/claimable';
import { claimOptions } from 'pages/basset/transactions/claimOptions';
import React, { useCallback, useEffect } from 'react';

export interface ClaimSectionProps {
  disabled: boolean;
  onProgress: (inProgress: boolean) => void;
}

export function ClaimSection({ disabled, onProgress }: ClaimSectionProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status } = useWallet();

  const { fixedGas } = useNetConstants();

  const [claim, claimResult] = useOperation(claimOptions, {});

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: claimable } = useClaimable();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const claimableRewards = useClaimableRewards(
    claimable?.claimableReward.balance,
    claimable?.rewardState.global_index,
    claimable?.claimableReward.index,
    claimable?.claimableReward.pending_rewards,
  );

  const invalidTxFee = useInvalidTxFee(bank, fixedGas);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(async () => {
    if (status.status !== 'ready' || bank.status !== 'connected') {
      return;
    }

    await claim({
      address: status.status === 'ready' ? status.walletAddress : '',
      bAsset: 'bluna',
      recipient: undefined,
    });
  }, [bank.status, claim, status]);

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
        <WarningMessage>{invalidTxFee}</WarningMessage>
      )}

      <ActionButton
        className="submit"
        disabled={
          status.status !== 'ready' ||
          bank.status !== 'connected' ||
          !!invalidTxFee ||
          claimableRewards.lte(0) ||
          disabled
        }
        onClick={() => proceed()}
      >
        Claim
      </ActionButton>
    </Section>
  );
}
