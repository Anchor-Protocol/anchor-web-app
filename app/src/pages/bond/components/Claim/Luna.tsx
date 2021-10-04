import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useBondClaimableRewards,
  useBondClaimTx,
  useBondWithdrawableAmount,
  useBondWithdrawTx,
} from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { formatLuna, formatUST } from '@anchor-protocol/notation';
import { Luna, u } from '@anchor-protocol/types';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { HorizontalHeavyRuler } from '@libs/neumorphism-ui/components/HorizontalHeavyRuler';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import { RewardLayout } from 'pages/bond/components/Claim/RewardLayout';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { claimableRewards as _claimableRewards } from '../../logics/claimableRewards';
import { withdrawAllHistory } from '../../logics/withdrawAllHistory';
import { WithdrawHistory } from './WithdrawHistory';

export interface ClaimLunaProps {
  className?: string;
}

function ClaimLunaBase({ className }: ClaimLunaProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const [claim, claimResult] = useBondClaimTx(COLLATERAL_DENOMS.UBLUNA);

  const [withdraw, withdrawResult] = useBondWithdrawTx();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useAnchorBank();

  const { data: { rewardState, claimableReward } = {} } =
    useBondClaimableRewards(COLLATERAL_DENOMS.UBLUNA);

  const {
    data: {
      withdrawableUnbonded: _withdrawableAmount,
      unbondedRequests: withdrawRequests,
      unbondedRequestsStartFrom,
      allHistory,
      parameters,
    } = {},
  } = useBondWithdrawableAmount();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedFee),
    [connectedWallet, tokenBalances.uUST, fixedFee],
  );

  const claimableRewards = useMemo(
    () => _claimableRewards(claimableReward, rewardState),
    [claimableReward, rewardState],
  );

  const withdrawableAmount = useMemo(
    () => big(_withdrawableAmount?.withdrawable ?? 0) as u<Luna<Big>>,
    [_withdrawableAmount?.withdrawable],
  );

  const withdrawHistory = useMemo(
    () =>
      withdrawAllHistory(
        withdrawRequests,
        unbondedRequestsStartFrom ?? -1,
        allHistory,
        parameters,
      ),
    [allHistory, parameters, unbondedRequestsStartFrom, withdrawRequests],
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

  const proceedWithdraw = useCallback(() => {
    if (!connectedWallet || !withdraw) {
      return;
    }

    withdraw({});
  }, [connectedWallet, withdraw]);

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

  if (
    withdrawResult?.status === StreamStatus.IN_PROGRESS ||
    withdrawResult?.status === StreamStatus.DONE
  ) {
    return (
      <div className={className}>
        <TxResultRenderer
          resultRendering={withdrawResult.value}
          onExit={() => {
            switch (withdrawResult.status) {
              case StreamStatus.IN_PROGRESS:
                withdrawResult.abort();
                break;
              case StreamStatus.DONE:
                withdrawResult.clear();
                break;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {!!invalidTxFee &&
        (claimableRewards.gt(0) || withdrawableAmount.gt(0)) && (
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

      <HorizontalHeavyRuler />

      <RewardLayout>
        <h4>
          <IconSpan>
            Withdrawable Amount{' '}
            <InfoTooltip>
              bAssets that have been burned and have surpassed the undelegation
              period can be withdrawn. Because burn requests are processed in
              3-day batches, requests that are not yet included in a batch are
              shown as pending.
            </InfoTooltip>
          </IconSpan>
        </h4>

        <p>
          {withdrawableAmount.gt(0) ? (
            <>
              {formatLuna(demicrofy(withdrawableAmount))}
              <span>LUNA</span>
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
              !withdraw ||
              !!invalidTxFee ||
              withdrawableAmount.lte(0)
            }
            onClick={() => proceedWithdraw()}
          >
            Withdraw
          </ActionButton>
        </ViewAddressWarning>
      </RewardLayout>

      <WithdrawHistory withdrawHistory={withdrawHistory} />
    </div>
  );
}

export const StyledClaimLuna = styled(ClaimLunaBase)`
  > hr {
    margin: 3em 0;
  }
`;

export const ClaimLuna = fixHMR(StyledClaimLuna);
