import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { demicrofy, formatUST } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService } from 'contexts/service';
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

  const { online } = useService();

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
  const claimableRewards = useClaimableRewards(
    claimableReward?.balance,
    rewardState?.global_index,
    claimableReward?.index,
    claimableReward?.pending_rewards,
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
        <MessageBox>{invalidTxFee}</MessageBox>
      )}

      <ActionButton
        className="submit"
        disabled={
          !online ||
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
