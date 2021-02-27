import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bLuna, Rate, ubLuna, uUST } from '@anchor-protocol/types';
import type { DialogProps, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletReady } from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { ArrowDownLine } from 'components/ArrowDownLine';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useMarketNotNullable } from 'pages/borrow/context/market';
import { currentLtv as _currentLtv } from 'pages/borrow/logics/currentLtv';
import { ltvToRedeemAmount } from 'pages/borrow/logics/ltvToRedeemAmount';
import { redeemAmountToLtv } from 'pages/borrow/logics/redeemAmountToLtv';
import { redeemCollateralBorrowLimit } from 'pages/borrow/logics/redeemCollateralBorrowLimit';
import { redeemCollateralMaxAmount } from 'pages/borrow/logics/redeemCollateralMaxAmount';
import { redeemCollateralNextLtv } from 'pages/borrow/logics/redeemCollateralNextLtv';
import { redeemCollateralWithdrawableAmount } from 'pages/borrow/logics/redeemCollateralWithdrawableAmount';
import { validateRedeemAmount } from 'pages/borrow/logics/validateRedeemAmount';
import { redeemCollateralOptions } from 'pages/borrow/transactions/redeemCollateralOptions';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useRedeemCollateralDialog(): [
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
  const {
    loanAmount,
    borrowInfo,
    bLunaMaxLtv,
    bLunaSafeLtv,
    oraclePrice,
  } = useMarketNotNullable();

  const { status } = useWallet();

  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const txFee = fixedGas;

  const [redeemCollateral, redeemCollateralResult] = useOperation(
    redeemCollateralOptions,
    {
      walletStatus: status,
    },
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [redeemAmount, setRedeemAmount] = useState<bLuna>('' as bLuna);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () =>
      redeemAmountToLtv(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
      ),
    [
      oraclePrice.rate,
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useMemo(
    () =>
      ltvToRedeemAmount(
        loanAmount.loan_amount,
        borrowInfo.balance,
        oraclePrice.rate,
      ),
    [oraclePrice.rate, borrowInfo.balance, loanAmount.loan_amount],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useServiceConnectedMemo(
    () =>
      _currentLtv(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
      ),
    [
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
      oraclePrice.rate,
    ],
    undefined,
  );

  const nextLtv = useServiceConnectedMemo(
    () => redeemCollateralNextLtv(redeemAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, redeemAmount],
    undefined,
  );

  const withdrawableAmount = useServiceConnectedMemo(
    () =>
      redeemCollateralWithdrawableAmount(
        loanAmount.loan_amount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
        bLunaSafeLtv,
        bLunaMaxLtv,
        nextLtv,
      ),
    [
      bLunaMaxLtv,
      bLunaSafeLtv,
      borrowInfo.balance,
      borrowInfo.spendable,
      loanAmount.loan_amount,
      nextLtv,
      oraclePrice.rate,
    ],
    big(0) as ubLuna<Big>,
  );

  const withdrawableMaxAmount = useServiceConnectedMemo(
    () =>
      redeemCollateralMaxAmount(
        loanAmount.loan_amount,
        borrowInfo.balance,
        oraclePrice.rate,
        bLunaMaxLtv,
      ),
    [bLunaMaxLtv, borrowInfo.balance, loanAmount.loan_amount, oraclePrice.rate],
    big(0) as ubLuna<Big>,
  );

  const borrowLimit = useServiceConnectedMemo(
    () =>
      redeemCollateralBorrowLimit(
        redeemAmount,
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
        bLunaMaxLtv,
      ),
    [
      bLunaMaxLtv,
      borrowInfo.balance,
      borrowInfo.spendable,
      oraclePrice.rate,
      redeemAmount,
    ],
    undefined,
  );

  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidRedeemAmount = useServiceConnectedMemo(
    () => validateRedeemAmount(redeemAmount, withdrawableMaxAmount),
    [redeemAmount, withdrawableMaxAmount],
    undefined,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRedeemAmount = useCallback((nextRedeemAmount: string) => {
    setRedeemAmount(nextRedeemAmount as bLuna);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      redeemAmount: bLuna,
      txFee: uUST<BigSource> | undefined,
    ) => {
      await redeemCollateral({
        address: walletReady.walletAddress,
        market: 'ust',
        amount: redeemAmount.length > 0 ? redeemAmount : '0',
        txFee: txFee!.toString() as uUST,
      });
    },
    [redeemCollateral],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateRedeemAmount(formatLunaInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateRedeemAmount],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Rate<Big>): Rate<Big> => {
      try {
        const draftAmount = ltvToAmount(draftLtv);
        return amountToLtv(draftAmount);
      } catch {
        return draftLtv;
      }
    },
    [ltvToAmount, amountToLtv],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const title = (
    <h1>
      <IconSpan>
        Redeem Collateral{' '}
        <InfoTooltip>Redeem bAsset to your wallet</InfoTooltip>
      </IconSpan>
    </h1>
  );

  if (
    redeemCollateralResult?.status === 'in-progress' ||
    redeemCollateralResult?.status === 'done' ||
    redeemCollateralResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer
            result={redeemCollateralResult}
            onExit={closeDialog}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        {title}

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={redeemAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REDEEM AMOUNT"
          error={!!invalidRedeemAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateRedeemAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">bLUNA</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidRedeemAmount}>
          <span>{invalidRedeemAmount}</span>
          <span>
            Withdrawable:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateRedeemAmount(
                  formatLunaInput(demicrofy(withdrawableAmount)),
                )
              }
            >
              {formatLuna(demicrofy(withdrawableAmount))} bLUNA
            </span>
          </span>
        </div>

        <ArrowDownLine style={{ margin: '10px 0' }} />

        <NumberInput
          className="limit"
          value={borrowLimit ? formatUSTInput(demicrofy(borrowLimit)) : ''}
          label="NEW BORROW LIMIT"
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
          style={{ pointerEvents: 'none' }}
        />

        <figure className="graph">
          <LTVGraph
            disabled={!serviceAvailable}
            maxLtv={bLunaMaxLtv}
            safeLtv={bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={bLunaMaxLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {redeemAmount.length > 0 && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            !serviceAvailable ||
            redeemAmount.length === 0 ||
            big(redeemAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidRedeemAmount
          }
          onClick={() =>
            walletReady && proceed(walletReady, redeemAmount, txFee)
          }
        >
          Proceed
        </ActionButton>
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
      color: #f5356a;
    }
  }

  .limit {
    width: 100%;
    margin-bottom: 60px;
  }

  .graph {
    margin-bottom: 40px;
  }

  .receipt {
    margin-bottom: 30px;
  }

  .proceed {
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
