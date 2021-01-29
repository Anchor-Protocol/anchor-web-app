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
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { FIXED_GAS } from 'env';
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
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useRedeemCollateralDialog(): [
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
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { marketUserOverview, marketOverview } = useMarketNotNullable();

  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const [redeemCollateral, redeemCollateralResult] = useOperation(
    redeemCollateralOptions,
    {
      addressProvider,
      post,
      client,
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
      ltvToRedeemAmount(
        marketUserOverview.loanAmount.loan_amount,
        marketUserOverview.borrowInfo.balance,
        marketOverview.oraclePrice.rate,
      ),
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.loanAmount.loan_amount,
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
  const nextLtv = useRedeemCollateralNextLtv(
    redeemAmount,
    currentLtv,
    amountToLtv,
  );
  const withdrawableAmount = useRedeemCollateralWithdrawableAmount(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
    marketOverview.bLunaSafeLtv,
    marketOverview.bLunaMaxLtv,
    nextLtv,
  );
  const withdrawableMaxAmount = useRedeemCollateralMaxAmount(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketOverview.oraclePrice.rate,
    marketOverview.bLunaMaxLtv,
  );
  const borrowLimit = useRedeemCollateralBorrowLimit(
    redeemAmount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
    marketOverview.bLunaMaxLtv,
  );

  const invalidTxFee = useInvalidTxFee(bank);
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

        {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

        <NumberInput
          className="amount"
          value={redeemAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REDEEM AMOUNT"
          error={!!invalidRedeemAmount}
          onChange={({ target }) => updateRedeemAmount(target.value)}
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
            maxLtv={marketOverview.bLunaMaxLtv}
            safeLtv={marketOverview.bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={marketOverview.bLunaMaxLtv}
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
