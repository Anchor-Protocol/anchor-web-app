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
import { bLuna, Rate, uUST } from '@anchor-protocol/types';
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
import { depositAmountToBorrowLimit } from 'pages/borrow/logics/depositAmountToBorrowLimit';
import { depositAmountToLtv } from 'pages/borrow/logics/depositAmountToLtv';
import { ltvToDepositAmount } from 'pages/borrow/logics/ltvToDepositAmount';
import { provideCollateralBorrowLimit } from 'pages/borrow/logics/provideCollateralBorrowLimit';
import { provideCollateralNextLtv } from 'pages/borrow/logics/provideCollateralNextLtv';
import { validateDepositAmount } from 'pages/borrow/logics/validateDepositAmount';
import { provideCollateralOptions } from 'pages/borrow/transactions/provideCollateralOptions';
import type { ChangeEvent, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useProvideCollateralDialog(): [
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

  const [provideCollateral, provideCollateralResult] = useOperation(
    provideCollateralOptions,
    {
      walletStatus: status,
    },
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [depositAmount, setDepositAmount] = useState<bLuna>('' as bLuna);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () =>
      depositAmountToLtv(
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
      ltvToDepositAmount(
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

  const amountToBorrowLimit = useMemo(
    () =>
      depositAmountToBorrowLimit(
        borrowInfo.balance,
        borrowInfo.spendable,
        oraclePrice.rate,
        bLunaMaxLtv,
      ),
    [bLunaMaxLtv, oraclePrice.rate, borrowInfo.balance, borrowInfo.spendable],
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
    () => provideCollateralNextLtv(depositAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, depositAmount],
    undefined,
  );

  const borrowLimit = useServiceConnectedMemo(
    () => provideCollateralBorrowLimit(depositAmount, amountToBorrowLimit),
    [amountToBorrowLimit, depositAmount],
    undefined,
  );

  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidDepositAmount = useServiceConnectedMemo(
    () => validateDepositAmount(depositAmount, bank),
    [bank, depositAmount],
    undefined,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as bLuna);
  }, []);

  const proceed = useCallback(
    async (
      walletReady: WalletReady,
      depositAmount: bLuna,
      txFee: uUST<BigSource> | undefined,
    ) => {
      await provideCollateral({
        address: walletReady.walletAddress,
        market: 'ust',
        symbol: 'bluna',
        amount: depositAmount,
        txFee: txFee!.toString() as uUST,
      });
    },
    [provideCollateral],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateDepositAmount(formatLunaInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateDepositAmount],
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
        Provide Collateral{' '}
        <InfoTooltip>
          Provide bAssets as collateral to borrow stablecoins
        </InfoTooltip>
      </IconSpan>
    </h1>
  );

  if (
    provideCollateralResult?.status === 'in-progress' ||
    provideCollateralResult?.status === 'done' ||
    provideCollateralResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer
            result={provideCollateralResult}
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
          value={depositAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="DEPOSIT AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateDepositAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">bLUNA</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidDepositAmount}>
          <span>{invalidDepositAmount}</span>
          <span>
            Wallet:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateDepositAmount(
                  formatLunaInput(demicrofy(bank.userBalances.ubLuna)),
                )
              }
            >
              {formatLuna(demicrofy(bank.userBalances.ubLuna))} bLUNA
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
            inputMode: 'numeric',
          }}
          style={{ pointerEvents: 'none' }}
        />

        {big(currentLtv ?? 0).gt(0) && (
          <figure className="graph">
            <LTVGraph
              disabled={!serviceAvailable}
              maxLtv={bLunaMaxLtv}
              safeLtv={bLunaSafeLtv}
              currentLtv={currentLtv}
              nextLtv={nextLtv}
              userMinLtv={0 as Rate<BigSource>}
              userMaxLtv={currentLtv}
              onStep={ltvStepFunction}
              onChange={onLtvChange}
            />
          </figure>
        )}

        {depositAmount.length > 0 && (
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
            depositAmount.length === 0 ||
            big(depositAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidDepositAmount
          }
          onClick={() =>
            walletReady && proceed(walletReady, depositAmount, txFee)
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
