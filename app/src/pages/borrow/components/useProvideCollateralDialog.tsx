import { fabricateProvideCollateral } from '@anchor-protocol/anchor-js/fabricators';
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
  microfy,
  Ratio,
  ubLuna,
  uUST,
} from '@anchor-protocol/notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import { CreateTxOptions } from '@terra-money/terra.js';
import big, { Big, BigSource } from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { FIXED_GAS, TRANSACTION_FEE } from 'env';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useCurrentLtv } from 'pages/borrow/components/useCurrentLtv';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import * as txi from 'queries/txInfos';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseTxResult, StringifiedTxResult, TxResult } from 'transactions/tx';

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

  const [
    queryProvideCollateral,
    provideCollateralResult,
    resetProvideCollateralResult,
  ] = useBroadcastableQuery(provideCollateralQueryOptions);

  const client = useApolloClient();

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
  const amountToLtv = useCallback(
    (depositAmount: ubLuna<Big>): Ratio<Big> => {
      return big(marketUserOverview.loanAmount.loan_amount).div(
        big(
          big(marketUserOverview.borrowInfo.balance)
            .minus(marketUserOverview.borrowInfo.spendable)
            .plus(depositAmount),
        ).mul(marketOverview.oraclePrice.rate),
      ) as Ratio<Big>;
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useCallback(
    (ltv: Ratio<Big>): ubLuna<Big> => {
      // ltv = loanAmount / ((balance - spendable + <amount>) * oracle)
      // amount = (loanAmount / (<ltv> * oracle)) + spendable - balance
      return big(
        big(marketUserOverview.loanAmount.loan_amount).div(
          ltv.mul(marketOverview.oraclePrice.rate),
        ),
      )
        .plus(marketUserOverview.borrowInfo.spendable)
        .minus(marketUserOverview.borrowInfo.balance) as ubLuna<Big>;
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const amountToBorrowLimit = useCallback(
    (depositAmount: ubLuna<Big>): uUST<Big> => {
      return big(
        big(
          big(marketUserOverview.borrowInfo.balance)
            .minus(marketUserOverview.borrowInfo.spendable)
            .plus(depositAmount),
        ).mul(marketOverview.oraclePrice.rate),
      ).mul(marketOverview.bLunaMaxLtv) as uUST<Big>;
    },
    [
      marketOverview.bLunaMaxLtv,
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
    ],
  );

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const currentLtv = useCurrentLtv({ marketOverview, marketUserOverview });

  // Loan_amount / ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice)
  const nextLtv = useMemo<Ratio<Big> | undefined>(() => {
    if (depositAmount.length === 0) {
      return currentLtv;
    }

    const amount = microfy(depositAmount);

    try {
      const ltv = amountToLtv(amount);
      return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
    } catch {
      return currentLtv;
    }
  }, [depositAmount, amountToLtv, currentLtv]);

  // New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV
  const borrowLimit = useMemo<uUST<Big> | undefined>(() => {
    return depositAmount.length > 0
      ? amountToBorrowLimit(microfy(depositAmount))
      : undefined;
  }, [amountToBorrowLimit, depositAmount]);

  const invalidTxFee = useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(FIXED_GAS)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidDepositAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || depositAmount.length === 0) {
      return undefined;
    } else if (microfy(depositAmount).gt(bank.userBalances.ubLuna ?? 0)) {
      return `Not enough assets`;
    }
    return undefined;
  }, [depositAmount, bank.status, bank.userBalances.ubLuna]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as bLuna);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      depositAmount,
    }: {
      status: WalletStatus;
      depositAmount: bLuna;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await queryProvideCollateral({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...TRANSACTION_FEE,
          msgs: fabricateProvideCollateral({
            address: status.status === 'ready' ? status.walletAddress : '',
            market: 'ust',
            symbol: 'bluna',
            amount: depositAmount,
          })(addressProvider),
        }).then(({ payload }) => parseTxResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryProvideCollateral],
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
    provideCollateralResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Provide Collateral</h1>
          <TxResultRenderer
            result={provideCollateralResult}
            resetResult={() => {
              resetProvideCollateralResult && resetProvideCollateralResult();
              closeDialog();
            }}
          />
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
          onClick={() => proceed({ status, depositAmount: depositAmount })}
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const provideCollateralQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'borrow/provide-collateral',
  notificationFactory: txNotificationFactory,
};

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
