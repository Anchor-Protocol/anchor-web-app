import { validateTxFee } from '@anchor-protocol/app-fns';
import {
  useAnchorBank,
  useBLunaWithdrawableAmount,
  useBondWithdrawTx,
} from '@anchor-protocol/app-provider';
import { formatLuna, formatUST } from '@anchor-protocol/notation';
import { useFixedFee } from '@libs/app-provider';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { Luna, u } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import { WithdrawHistory } from 'pages/bond/components/Claim/WithdrawHistory';
import { withdrawAllHistory } from 'pages/bond/logics/withdrawAllHistory';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

export interface BlunaWithdrawProps {
  className?: string;
}

function Component({ className }: BlunaWithdrawProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const fixedFee = useFixedFee();

  const [withdraw, withdrawResult] = useBondWithdrawTx();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useAnchorBank();

  const {
    data: {
      withdrawableUnbonded: _withdrawableAmount,
      unbondedRequests: withdrawRequests,
      unbondedRequestsStartFrom,
      allHistory,
      parameters,
    } = {},
  } = useBLunaWithdrawableAmount();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedFee),
    [connectedWallet, tokenBalances.uUST, fixedFee],
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
      {!!invalidTxFee && withdrawableAmount.gt(0) && (
        <MessageBox>{invalidTxFee}</MessageBox>
      )}

      <h4>
        <IconSpan>
          WITHDRAWABLE AMOUNT{' '}
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

      {withdrawableAmount.gt(0) && (
        <TxFeeList className="withdraw-receipt">
          <TxFeeListItem label="Tx Fee">
            {formatUST(demicrofy(fixedFee))} UST
          </TxFeeListItem>
        </TxFeeList>
      )}

      <WithdrawHistory withdrawHistory={withdrawHistory} />
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BlunaWithdraw = fixHMR(StyledComponent);
