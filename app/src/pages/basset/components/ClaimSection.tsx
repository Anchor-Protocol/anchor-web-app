import { demicrofy, formatUST } from '@anchor-protocol/notation';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
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
  const connectedWallet = useConnectedWallet();

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
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const claimableRewards = useMemo(
    () => _claimableRewards(claimableReward, rewardState),
    [claimableReward, rewardState],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    async (walletReady: ConnectedWallet) => {
      await claim({
        address: walletReady.walletAddress,
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
              provided as collateral. If the user's claimable reward is smaller
              than the gas fee, the rewards are not claimable.
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
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !!invalidTxFee ||
          claimableRewards.lte(fixedGas) ||
          disabled
        }
        onClick={() => connectedWallet && proceed(connectedWallet)}
      >
        Claim
      </ActionButton>
    </Section>
  );
}
