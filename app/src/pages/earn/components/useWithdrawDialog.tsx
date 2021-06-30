import {
  demicrofy,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { aUST, UST, uUST } from '@anchor-protocol/types';
import {
  AnchorTokenBalances,
  computeTotalDeposit,
  useEarnEpochStatesQuery,
  useEarnWithdrawForm,
  useEarnWithdrawTx,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import big, { BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useWithdrawDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const [withdraw, withdrawResult] = useEarnWithdrawTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const {
    withdrawAmount,
    receiveAmount,
    txFee,
    invalidTxFee,
    invalidWithdrawAmount,
    updateWithdrawAmount,
    availablePost,
  } = useEarnWithdrawForm();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const {
    tokenBalances: { uaUST },
  } = useBank<AnchorTokenBalances>();

  const { data } = useEarnEpochStatesQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const { totalDeposit } = useMemo(() => {
    return {
      totalDeposit: computeTotalDeposit(uaUST, data?.moneyMarketEpochState),
    };
  }, [data?.moneyMarketEpochState, uaUST]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    async (withdrawAmount: UST, txFee: uUST<BigSource> | undefined) => {
      if (!connectedWallet || !withdraw || !data) {
        return;
      }

      withdraw({
        withdrawAmount: big(withdrawAmount)
          .div(data.moneyMarketEpochState.exchange_rate)
          .toString() as aUST,
        txFee: txFee!.toString() as uUST,
      });
    },
    [connectedWallet, data, withdraw],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === StreamStatus.IN_PROGRESS ||
    withdrawResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={withdrawResult.value}
            onExit={closeDialog}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Withdraw</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={withdrawAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidWithdrawAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateWithdrawAmount(target.value as UST)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidWithdrawAmount}>
          <span>{invalidWithdrawAmount}</span>
          <span>
            Max:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                totalDeposit.gt(0) &&
                updateWithdrawAmount(formatUSTInput(demicrofy(totalDeposit)))
              }
            >
              {formatUST(demicrofy(totalDeposit))} UST
            </span>
          </span>
        </div>

        {txFee && receiveAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Receive Amount">
              {formatUST(demicrofy(receiveAmount))} UST
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
              !availablePost
            }
            onClick={() => proceed(withdrawAmount, txFee)}
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .wallet {
    display: flex;
    justify-content: space-between;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: ${({ theme }) => theme.colors.negative};
    }
  }

  .receipt {
    margin-top: 30px;
  }

  .proceed {
    margin-top: 65px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
