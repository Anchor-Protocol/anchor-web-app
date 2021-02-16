import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  bLuna,
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  Ratio,
  uUST,
} from '@anchor-protocol/notation';
import type { DialogProps, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { ArrowDownLine } from 'components/ArrowDownLine';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService } from 'contexts/service';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useMarketNotNullable } from 'pages/borrow/context/market';
import { ltvToRedeemAmount } from 'pages/borrow/logics/ltvToRedeemAmount';
import { redeemAmountToLtv } from 'pages/borrow/logics/redeemAmountToLtv';
import { useCurrentLtv } from 'pages/borrow/logics/useCurrentLtv';
import { useInvalidRedeemAmount } from 'pages/borrow/logics/useInvalidRedeemAmount';
import { useRedeemCollateralBorrowLimit } from 'pages/borrow/logics/useRedeemCollateralBorrowLimit';
import { useRedeemCollateralMaxAmount } from 'pages/borrow/logics/useRedeemCollateralMaxAmount';
import { useRedeemCollateralNextLtv } from 'pages/borrow/logics/useRedeemCollateralNextLtv';
import { useRedeemCollateralWithdrawableAmount } from 'pages/borrow/logics/useRedeemCollateralWithdrawableAmount';
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

  const { online } = useService();

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
  const currentLtv = useCurrentLtv(
    loanAmount.loan_amount,
    borrowInfo.balance,
    borrowInfo.spendable,
    oraclePrice.rate,
  );
  const nextLtv = useRedeemCollateralNextLtv(
    redeemAmount,
    currentLtv,
    amountToLtv,
  );
  const withdrawableAmount = useRedeemCollateralWithdrawableAmount(
    loanAmount.loan_amount,
    borrowInfo.balance,
    borrowInfo.spendable,
    oraclePrice.rate,
    bLunaSafeLtv,
    bLunaMaxLtv,
    nextLtv,
  );
  const withdrawableMaxAmount = useRedeemCollateralMaxAmount(
    loanAmount.loan_amount,
    borrowInfo.balance,
    oraclePrice.rate,
    bLunaMaxLtv,
  );
  const borrowLimit = useRedeemCollateralBorrowLimit(
    redeemAmount,
    borrowInfo.balance,
    borrowInfo.spendable,
    oraclePrice.rate,
    bLunaMaxLtv,
  );

  const invalidTxFee = useInvalidTxFee(bank, fixedGas);
  const invalidRedeemAmount = useInvalidRedeemAmount(
    redeemAmount,
    bank,
    withdrawableMaxAmount,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRedeemAmount = useCallback((nextRedeemAmount: string) => {
    setRedeemAmount(nextRedeemAmount as bLuna);
  }, []);

  const proceed = useCallback(
    async (
      status: WalletStatus,
      redeemAmount: bLuna,
      txFee: uUST<BigSource> | undefined,
    ) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await redeemCollateral({
        address: status.walletAddress,
        market: 'ust',
        amount: redeemAmount.length > 0 ? redeemAmount : '0',
        txFee: txFee!.toString() as uUST,
      });
    },
    [bank.status, redeemCollateral],
  );

  const onLtvChange = useCallback(
    (nextLtv: Ratio<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateRedeemAmount(formatLunaInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateRedeemAmount],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Ratio<Big>): Ratio<Big> => {
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
            !online ||
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            redeemAmount.length === 0 ||
            big(redeemAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidRedeemAmount
          }
          onClick={() => proceed(status, redeemAmount, txFee)}
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
