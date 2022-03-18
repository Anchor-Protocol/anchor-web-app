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
import { Section } from '@libs/neumorphism-ui/components/Section';
import { Luna, u } from '@libs/types';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { MessageBox } from 'components/MessageBox';
import { Sub } from 'components/Sub';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { fixHMR } from 'fix-hmr';
import { BLunaBurnProcess } from 'pages/basset/components/BLunaBurnProcess';
import { WithdrawHistory } from 'pages/basset/components/WithdrawHistory';
import { withdrawAllHistory } from 'pages/basset/logics/withdrawAllHistory';
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
    data: bLunaWithdrawableAmount,
    refetch: refetchBLunaWithdrawableAmount,
  } = useBLunaWithdrawableAmount();

  const {
    withdrawableUnbonded: _withdrawableAmount,
    unbondedRequests: withdrawRequests,
    unbondedRequestsStartFrom,
    allHistory,
    parameters,
  } = bLunaWithdrawableAmount || {};

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
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [
      allHistory,
      parameters,
      unbondedRequestsStartFrom,
      withdrawRequests,
      bLunaWithdrawableAmount,
      withdrawResult?.status,
    ],
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
      <CenteredLayout className={className} maxWidth={720}>
        <Section>
          <TxResultRenderer
            resultRendering={withdrawResult.value}
            onExit={() => {
              switch (withdrawResult.status) {
                case StreamStatus.IN_PROGRESS:
                  withdrawResult.abort();
                  break;
                case StreamStatus.DONE:
                  refetchBLunaWithdrawableAmount();
                  withdrawResult.clear();
                  break;
              }
            }}
          />
        </Section>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout className={className} maxWidth={720}>
      <Section>
        <h1>
          <IconSpan>
            Withdrawable Luna{' '}
            <InfoTooltip>
              bAssets that have been burned and have surpassed the undelegation
              period can be withdrawn. Because burn requests are processed in
              3-day batches, requests that are not yet included in a batch are
              shown as pending.
            </InfoTooltip>
          </IconSpan>
        </h1>

        {!!invalidTxFee && withdrawableAmount.gt(0) && (
          <MessageBox>{invalidTxFee}</MessageBox>
        )}

        <div className="amount">
          {withdrawableAmount.gt(0) ? (
            <>
              {formatLuna(demicrofy(withdrawableAmount))} <Sub>LUNA</Sub>
            </>
          ) : (
            '-'
          )}
        </div>

        {withdrawHistory && withdrawHistory.length > 0 && (
          <WithdrawHistory withdrawHistory={withdrawHistory} />
        )}

        <BLunaBurnProcess style={{ marginTop: 20 }} />

        {withdrawableAmount.gt(0) && (
          <TxFeeList className="receipt">
            <TxFeeListItem label="Tx Fee">
              {formatUST(demicrofy(fixedFee))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
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
      </Section>
    </CenteredLayout>
  );
}

const StyledComponent = styled(Component)`
  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    font-size: 32px;
    font-weight: normal;
    text-align: center;

    sub {
      font-size: 18px;
      font-weight: 500;
    }
  }

  .receipt {
    margin-top: 40px;
  }

  .proceed {
    margin-top: 40px;

    width: 100%;
    height: 60px;
  }

  --pending-color: ${({ theme }) =>
    theme.palette.type === 'dark' ? '#6bbd7e' : '#38D938'};

  --unbonding-color: ${({ theme }) =>
    theme.palette.type === 'dark' ? '#228323' : '#36A337'};

  --withdrawable-color: ${({ theme }) =>
    theme.palette.type === 'dark' ? '#d3d3d3' : '#1A1A1A'};
`;

export const BlunaWithdraw = fixHMR(StyledComponent);
