import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { formatUST } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import {
  useBondBEthClaimableRewards,
  useBondClaimTx,
  validateTxFee,
} from '@anchor-protocol/webapp-provider';
import { useAnchorBank } from '@anchor-protocol/webapp-provider/hooks/useAnchorBank';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { RewardLayout } from './RewardLayout';

export interface ClaimEthProps {
  className?: string;
}

function ClaimEthBase({ className }: ClaimEthProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useBondClaimTx(COLLATERAL_DENOMS.UBETH);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useAnchorBank();

  const { data: { claimableReward } = {} } = useBondBEthClaimableRewards();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedFee),
    [connectedWallet, tokenBalances.uUST, fixedFee],
  );

  const claimableRewards = useMemo(
    () => big(claimableReward?.rewards ?? 0) as u<UST<Big>>,
    [claimableReward],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceedClaim = useCallback(() => {
    if (!connectedWallet || !claim) {
      return;
    }

    claim({});
  }, [claim, connectedWallet]);

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

      <RewardLayout>
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
          {claimableRewards.gt(0) ? (
            <>
              {formatUST(demicrofy(claimableRewards))}
              <span>UST</span>
            </>
          ) : (
            '-'
          )}
        </p>

        <ViewAddressWarning>
          <ActionButton
            className="submit"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !claim ||
              !!invalidTxFee ||
              claimableRewards.lte(fixedFee)
            }
            onClick={() => proceedClaim()}
          >
            Claim
          </ActionButton>
        </ViewAddressWarning>
      </RewardLayout>
    </div>
  );
}

export const StyledClaimEth = styled(ClaimEthBase)`
  // TODO
`;

export const ClaimEth = fixHMR(StyledClaimEth);
