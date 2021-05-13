import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import {
  demicrofy,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { UST, uUST } from '@anchor-protocol/types';
import { useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus, useStream } from '@rx-stream/react';
import { useOperationBroadcaster } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@terra-dev/neumorphism-ui/components/useConfirm';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import {
  ConnectedWallet,
  useConnectedWallet,
} from '@terra-money/wallet-provider';
import { useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import { useAddressProvider } from 'base/contexts/contract';
import big, { BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxRenderer } from 'components/TxRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import { depositRecommendationAmount } from 'pages/earn/logics/depositRecommendationAmount';
import { depositSendAmount } from 'pages/earn/logics/depositSendAmount';
import { depositTxFee } from 'pages/earn/logics/depositTxFee';
import { validateDepositAmount } from 'pages/earn/logics/validateDepositAmount';
import { validateDepositNextTransaction } from 'pages/earn/logics/validateDepositNextTransaction';
import { depositTxStream } from 'pages/earn/tx/depositTxStream';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useDepositDialog(): [
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

  const { fixedGas, gasFee, gasAdjustment } = useConstants();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const { errorReporter } = useOperationBroadcaster();

  const [openConfirm, confirmElement] = useConfirm();

  const [deposit, depositResult] = useStream(depositTxStream);

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [depositAmount, setDepositAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const txFee = useMemo(() => depositTxFee(depositAmount, bank, fixedGas), [
    bank,
    depositAmount,
    fixedGas,
  ]);

  const sendAmount = useMemo(() => depositSendAmount(depositAmount, txFee), [
    depositAmount,
    txFee,
  ]);

  const maxAmount = useMemo(() => depositRecommendationAmount(bank, fixedGas), [
    bank,
    fixedGas,
  ]);

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidDepositAmount = useMemo(
    () => validateDepositAmount(depositAmount, bank, txFee),
    [bank, depositAmount, txFee],
  );

  const invalidNextTransaction = useMemo(
    () =>
      validateDepositNextTransaction(
        depositAmount,
        bank,
        txFee,
        fixedGas,
        !!invalidDepositAmount || !maxAmount,
      ),
    [bank, depositAmount, fixedGas, invalidDepositAmount, maxAmount, txFee],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as UST);
  }, []);

  const proceed = useCallback(
    async (
      status: ConnectedWallet,
      depositAmount: string,
      txFee: uUST<BigSource> | undefined,
      confirm: ReactNode,
    ) => {
      if (!connectedWallet) return;

      if (confirm) {
        const userConfirm = await openConfirm({
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
        });

        if (!userConfirm) {
          return;
        }
      }

      await deposit({
        address: status.walletAddress,
        market: MARKET_DENOMS.UUSD,
        amount: depositAmount,
        txFee: txFee!.toString() as uUST,
        gasAdjustment,
        addressProvider,
        client,
        gasFee,
        post: connectedWallet?.post,
        reportError: errorReporter,
      });
    },
    [
      addressProvider,
      client,
      connectedWallet,
      deposit,
      errorReporter,
      gasAdjustment,
      gasFee,
      openConfirm,
    ],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    depositResult.status === StreamStatus.IN_PROGRESS ||
    depositResult.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxRenderer txRender={depositResult.value} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateDepositAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidDepositAmount}>
          <span>{invalidDepositAmount}</span>
          <span>
            Max:{' '}
            <span
              style={
                maxAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                maxAmount &&
                updateDepositAmount(formatUSTInput(demicrofy(maxAmount)))
              }
            >
              {maxAmount ? formatUST(demicrofy(maxAmount)) : 0} UST
            </span>
          </span>
        </div>

        {txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        {invalidNextTransaction && maxAmount && (
          <MessageBox style={{ marginTop: 30, marginBottom: 0 }}>
            {invalidNextTransaction}
          </MessageBox>
        )}

        <ActionButton
          className="proceed"
          style={
            invalidNextTransaction
              ? {
                  backgroundColor: '#c12535',
                }
              : undefined
          }
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            depositAmount.length === 0 ||
            big(depositAmount).lte(0) ||
            !!invalidDepositAmount
          }
          onClick={() =>
            connectedWallet &&
            proceed(
              connectedWallet,
              depositAmount,
              txFee,
              invalidNextTransaction,
            )
          }
        >
          Proceed
        </ActionButton>

        {confirmElement}
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
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
