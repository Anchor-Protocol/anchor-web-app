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
} from '@anchor-protocol/notation';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { Big, BigSource } from 'big.js';
import { OperationRenderer } from 'components/OperationRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { FIXED_GAS } from 'env';
import { useInvalidTxFee } from 'logics/useInvalidTxFee';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { depositAmountToBorrowLimit } from 'pages/borrow/logics/depositAmountToBorrowLimit';
import { depositAmountToLtv } from 'pages/borrow/logics/depositAmountToLtv';
import { ltvToDepositAmount } from 'pages/borrow/logics/ltvToDepositAmount';
import { useCurrentLtv } from 'pages/borrow/logics/useCurrentLtv';
import { useInvalidDepositAmount } from 'pages/borrow/logics/useInvalidDepositAmount';
import { useProvideCollateralBorrowLimit } from 'pages/borrow/logics/useProvideCollateralBorrowLimit';
import { useProvideCollateralNextLtv } from 'pages/borrow/logics/useProvideCollateralNextLtv';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import { provideCollateralOptions } from 'pages/borrow/transactions/provideCollateralOptions';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}

type FormReturn = void;

export function useProvideCollateralDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

const txFee = FIXED_GAS;

function ComponentBase({
  className,
  marketOverview,
  marketUserOverview,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const [provideCollateral, provideCollateralResult] = useOperation(
    provideCollateralOptions,
    {
      addressProvider,
      post,
      client,
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
        marketUserOverview.loanAmount.loan_amount,
        marketUserOverview.borrowInfo.balance,
        marketUserOverview.borrowInfo.spendable,
        marketOverview.oraclePrice.rate,
      ),
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useMemo(
    () =>
      ltvToDepositAmount(
        marketUserOverview.loanAmount.loan_amount,
        marketUserOverview.borrowInfo.balance,
        marketUserOverview.borrowInfo.spendable,
        marketOverview.oraclePrice.rate,
      ),
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const amountToBorrowLimit = useMemo(
    () =>
      depositAmountToBorrowLimit(
        marketUserOverview.borrowInfo.balance,
        marketUserOverview.borrowInfo.spendable,
        marketOverview.oraclePrice.rate,
        marketOverview.bLunaMaxLtv,
      ),
    [
      marketOverview.bLunaMaxLtv,
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
    ],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useCurrentLtv(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
  );
  const nextLtv = useProvideCollateralNextLtv(
    depositAmount,
    currentLtv,
    amountToLtv,
  );
  const borrowLimit = useProvideCollateralBorrowLimit(
    depositAmount,
    amountToBorrowLimit,
  );

  const invalidTxFee = useInvalidTxFee(bank);
  const invalidDepositAmount = useInvalidDepositAmount(depositAmount, bank);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as bLuna);
  }, []);

  const proceed = useCallback(
    async (status: WalletStatus, depositAmount: bLuna) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await provideCollateral({
        address: status.status === 'ready' ? status.walletAddress : '',
        market: 'ust',
        symbol: 'bluna',
        amount: depositAmount,
      });
    },
    [bank.status, provideCollateral],
  );

  const onLtvChange = useCallback(
    (nextLtv: Ratio<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateDepositAmount(formatLunaInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateDepositAmount],
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
  if (
    provideCollateralResult?.status === 'in-progress' ||
    provideCollateralResult?.status === 'done' ||
    provideCollateralResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Provide Collateral</h1>
          {provideCollateralResult.status === 'done' ? (
            <div>
              <pre>{JSON.stringify(provideCollateralResult.data, null, 2)}</pre>
              <ActionButton
                style={{ width: 200 }}
                onClick={() => closeDialog()}
              >
                Close
              </ActionButton>
            </div>
          ) : (
            <OperationRenderer result={provideCollateralResult} />
          )}
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Provide Collateral</h1>

        {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="DEPOSIT AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }) => updateDepositAmount(target.value)}
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

        <figure className="graph">
          <LTVGraph
            maxLtv={marketOverview.bLunaMaxLtv}
            safeLtv={marketOverview.bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={0 as Ratio<BigSource>}
            userMaxLtv={currentLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

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
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            depositAmount.length === 0 ||
            big(depositAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidDepositAmount
          }
          onClick={() => proceed(status, depositAmount)}
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

    margin-bottom: 25px;
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
