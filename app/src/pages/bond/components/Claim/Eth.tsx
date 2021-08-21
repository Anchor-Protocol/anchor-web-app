import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { demicrofy, formatUST } from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  useAnchorWebapp,
  useBondBEthClaimableRewards,
  useBondClaimTx,
  validateTxFee,
} from '@anchor-protocol/webapp-provider';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@packages/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@packages/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@packages/neumorphism-ui/components/InfoTooltip';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@packages/webapp-provider';
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

  const {
    constants: { fixedGas },
  } = useAnchorWebapp();

  const [claim, claimResult] = useBondClaimTx(COLLATERAL_DENOMS.UBETH);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useBank<AnchorTokenBalances, AnchorTax>();

  const { data: { claimableReward } = {} } = useBondBEthClaimableRewards();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedGas),
    [connectedWallet, tokenBalances.uUST, fixedGas],
  );

  const claimableRewards = useMemo(
    () => big(claimableReward?.rewards ?? 0) as uUST<Big>,
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
              claimableRewards.lte(fixedGas)
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
