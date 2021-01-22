import { fabricateRepay } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUST,
  formatUSTInput,
  microfy,
  Ratio,
  UST,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
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
import { WarningArticle } from 'components/WarningArticle';
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useCurrentLtv } from 'pages/borrow/components/useCurrentLtv';
import { Data as MarketBalance } from 'pages/borrow/queries/marketBalanceOverview';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import * as txi from 'queries/txInfos';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';

interface FormParams {
  className?: string;
  marketBalance: MarketBalance;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}

type FormReturn = void;

export function useRepayDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

function ComponentBase({
  className,
  marketBalance,
  marketOverview,
  marketUserOverview,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [queryRepay, repayResult, resetRepayResult] = useBroadcastableQuery(
    repayQueryOptions,
  );

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [repayAmount, setRepayAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useCallback(
    (amount: uUST<Big>): Ratio<Big> => {
      return big(
        big(marketUserOverview.loanAmount.loan_amount).minus(amount),
      ).div(
        big(
          big(marketUserOverview.borrowInfo.balance).minus(
            marketUserOverview.borrowInfo.spendable,
          ),
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
    (ltv: Ratio<Big>): uUST<Big> => {
      return big(marketUserOverview.loanAmount.loan_amount).minus(
        ltv.mul(
          big(
            big(marketUserOverview.borrowInfo.balance).minus(
              marketUserOverview.borrowInfo.spendable,
            ),
          ).mul(marketOverview.oraclePrice.rate),
        ),
      ) as uUST<Big>;
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const currentLtv = useCurrentLtv({ marketOverview, marketUserOverview });

  // (Loan_amount - repay_amount) / ((Borrow_info.balance - Borrow_info.spendable) * Oracleprice)
  const userLtv = useMemo<Ratio<Big> | undefined>(() => {
    if (repayAmount.length === 0) {
      return currentLtv;
    }

    const userAmount = microfy(repayAmount);

    try {
      const ltv = amountToLtv(userAmount);
      return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
    } catch {
      return currentLtv;
    }
  }, [amountToLtv, repayAmount, currentLtv]);

  const apr = useMemo<Ratio<Big>>(() => {
    return big(marketOverview.borrowRate.rate).mul(
      BLOCKS_PER_YEAR,
    ) as Ratio<Big>;
  }, [marketOverview.borrowRate.rate]);

  const totalBorrows = useMemo<uUST<Big>>(() => {
    const bufferBlocks = 20;

    //- block_height = marketBalanceOverview.ts / currentBlock
    //- global_index = marketBalanceOverview.ts / marketState.global_interest_index
    //- last_interest_updated = marketBalanceOverview.ts / marketState.last_interest_updated
    //- borrowRate = marketOverview.ts / borrowRate.rate
    //- loan_amount = marketUserOverview.ts / loanAmont.loan_amount
    //- interest_index = marketUserOverview.ts / loanAmont.interest_index

    const passedBlock = big(marketBalance.currentBlock).minus(
      marketBalance.marketState.last_interest_updated,
    );
    const interestFactor = passedBlock.mul(marketOverview.borrowRate.rate);
    const globalInterestIndex = big(
      marketBalance.marketState.global_interest_index,
    ).mul(big(1).plus(interestFactor));
    const bufferInterestFactor = big(marketOverview.borrowRate.rate).mul(
      bufferBlocks,
    );
    const totalBorrowsWithoutBuffer = big(
      marketUserOverview.loanAmount.loan_amount,
    ).mul(
      big(globalInterestIndex).div(marketUserOverview.liability.interest_index),
    );
    const totalBorrows = totalBorrowsWithoutBuffer.mul(
      big(1).plus(bufferInterestFactor),
    );

    //console.log('useRepayDialog.tsx..()', totalBorrows.toString(), marketUserOverview.loanAmount.loan_amount);

    return (totalBorrows.lt(0.001) ? big(0.001) : totalBorrows) as uUST<Big>;
  }, [
    marketBalance.currentBlock,
    marketBalance.marketState.global_interest_index,
    marketBalance.marketState.last_interest_updated,
    marketOverview.borrowRate.rate,
    marketUserOverview.liability.interest_index,
    marketUserOverview.loanAmount,
  ]);

  const txFee = useMemo<uUST<Big> | undefined>(() => {
    if (repayAmount.length === 0) {
      return undefined;
    }

    const userAmount = microfy(repayAmount);

    const userAmountTxFee = userAmount.mul(bank.tax.taxRate);

    if (userAmountTxFee.gt(bank.tax.maxTaxUUSD)) {
      return big(bank.tax.maxTaxUUSD).plus(fixedGasUUSD) as uUST<Big>;
    } else {
      return userAmountTxFee.plus(fixedGasUUSD) as uUST<Big>;
    }
  }, [repayAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);

  const totalOutstandingLoan = useMemo<uUST<Big> | undefined>(() => {
    return repayAmount.length > 0
      ? (big(marketUserOverview.loanAmount.loan_amount).minus(
          microfy(repayAmount),
        ) as uUST<Big>)
      : undefined;
  }, [repayAmount, marketUserOverview.loanAmount.loan_amount]);

  const sendAmount = useMemo<uUST<Big> | undefined>(() => {
    return repayAmount.length > 0 && txFee
      ? (microfy(repayAmount).plus(txFee) as uUST<Big>)
      : undefined;
  }, [repayAmount, txFee]);

  const invalidTxFee = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(fixedGasUUSD)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || repayAmount.length === 0) {
      return undefined;
    } else if (microfy(repayAmount).gt(bank.userBalances.uUSD)) {
      return `Not enough assets`;
    }
    return undefined;
  }, [repayAmount, bank.status, bank.userBalances.uUSD]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRepayAmount = useCallback((nextRepayAmount: string) => {
    setRepayAmount(nextRepayAmount as UST);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      repayAmount,
    }: {
      status: WalletStatus;
      repayAmount: UST;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await queryRepay({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateRepay({
            address: status.status === 'ready' ? status.walletAddress : '',
            market: 'ust',
            amount: repayAmount,
            borrower: undefined,
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryRepay],
  );

  const onLtvChange = useCallback(
    (nextLtv: Ratio<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateRepayAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateRepayAmount],
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
    repayResult?.status === 'in-progress' ||
    repayResult?.status === 'done' ||
    repayResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>
            Repay<p>Borrow APR: {formatRatioToPercentage(apr)}%</p>
          </h1>
          <TxResultRenderer
            result={repayResult}
            resetResult={() => {
              resetRepayResult && resetRepayResult();
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
        <h1>
          Repay<p>Borrow APR: {formatRatioToPercentage(apr)}%</p>
        </h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={repayAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REPAY AMOUNT"
          error={!!invalidAssetAmount}
          onChange={({ target }) => updateRepayAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidAssetAmount}>
          <span>{invalidAssetAmount}</span>
          <span>
            Total Borrowed:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateRepayAmount(formatUSTInput(demicrofy(totalBorrows)))
              }
            >
              {formatUST(demicrofy(totalBorrows))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            maxLtv={marketOverview.bLunaMaxLtv}
            safeLtv={marketOverview.bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={userLtv}
            userMinLtv={0 as Ratio<BigSource>}
            userMaxLtv={currentLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {totalOutstandingLoan && txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label="Total Outstanding Loan">
              {totalOutstandingLoan.lt(0)
                ? 0
                : formatUST(demicrofy(totalOutstandingLoan))}{' '}
              UST
            </TxFeeListItem>
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            repayAmount.length === 0 ||
            big(repayAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAssetAmount
          }
          onClick={() => proceed({ status, repayAmount: repayAmount })}
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const repayQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'borrow/repay',
  notificationFactory: txNotificationFactory,
};

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    p {
      font-size: 14px;
      margin-top: 10px;
    }

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

    margin-bottom: 45px;
  }

  .limit {
    width: 100%;
    margin-bottom: 30px;
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
