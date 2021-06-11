import { demicrofy, formatUST } from '@anchor-protocol/notation';
import {
  useAnchorWebapp,
  useBondClaimableRewards,
  useBondClaimTx,
} from '@anchor-protocol/webapp-provider';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'base/contexts/bank';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
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

  const {
    constants: { gas },
  } = useAnchorWebapp();

  const [claim, claimResult] = useBondClaimTx();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { data: { rewardState, claimableReward } = {} } =
    useBondClaimableRewards();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, gas.bondClaim.fixedGas),
    [connectedWallet, bank, gas.bondClaim.fixedGas],
  );

  const claimableRewards = useMemo(
    () => _claimableRewards(claimableReward, rewardState),
    [claimableReward, rewardState],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(() => {
    if (!connectedWallet || !claim) {
      return;
    }

    claim({});
  }, [claim, connectedWallet]);

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    onProgress(claimResult?.status === StreamStatus.IN_PROGRESS);
  }, [claimResult?.status, onProgress]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    claimResult?.status === StreamStatus.IN_PROGRESS ||
    claimResult?.status === StreamStatus.DONE
  ) {
    return (
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
          !claim ||
          !!invalidTxFee ||
          claimableRewards.lte(gas.bondClaim.fixedGas) ||
          disabled
        }
        onClick={() => proceed()}
      >
        Claim
      </ActionButton>
    </Section>
  );
}
