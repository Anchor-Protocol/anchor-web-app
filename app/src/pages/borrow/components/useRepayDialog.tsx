import {
  demicrofy,
  formatRate,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, UST, uUST } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  BorrowBorrower,
  BorrowMarket,
  computeBorrowAPR,
  computeCurrentLtv,
  computeLtvToRepayAmount,
  computeMaxRepayingAmount,
  computeRepayAmountToLtv,
  computeRepayNextLtv,
  computeRepaySendAmount,
  computeRepayTotalOutstandingLoan,
  computeRepayTxFee,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useBorrowRepayTx,
  validateRepayAmount,
  validateTxFee,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@packages/neumorphism-ui/components/ActionButton';
import { Dialog } from '@packages/neumorphism-ui/components/Dialog';
import { IconSpan } from '@packages/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@packages/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@packages/neumorphism-ui/components/NumberInput';
import type { DialogProps, OpenDialog } from '@packages/use-dialog';
import { useDialog } from '@packages/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@packages/webapp-provider';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { EstimatedLiquidationPrice } from 'pages/borrow/components/EstimatedLiquidationPrice';
import { estimateLiquidationPrice } from 'pages/borrow/logics/estimateLiquidationPrice';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  fallbackBorrowMarket: BorrowMarket;
  fallbackBorrowBorrower: BorrowBorrower;
}

type FormReturn = void;

export function useRepayDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
  fallbackBorrowMarket,
  fallbackBorrowBorrower,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas, blocksPerYear },
  } = useAnchorWebapp();

  const [repay, repayResult] = useBorrowRepayTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [repayAmount, setRepayAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances, tax } = useBank<AnchorTokenBalances, AnchorTax>();

  const {
    data: {
      borrowRate,
      oraclePrices,
      bAssetLtvsAvg,
      //bLunaOraclePrice,
      //bLunaMaxLtv = '0.5' as Rate,
      //bLunaSafeLtv = '0.3' as Rate,
      marketState,
      overseerWhitelist,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: {
      marketBorrowerInfo,
      overseerCollaterals,
      //bLunaCustodyBorrower: borrowInfo,
      blockHeight,
    } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const dangerLtv = useMemo(() => {
    return big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;
  }, [bAssetLtvsAvg.max]);

  const amountToLtv = useMemo(
    () =>
      computeRepayAmountToLtv(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const ltvToAmount = useMemo(
    () =>
      computeLtvToRepayAmount(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const { currentLtv, apr, maxRepayingAmount, invalidTxFee } = useMemo(() => {
    const currentLtv = computeCurrentLtv(
      marketBorrowerInfo,
      overseerCollaterals,
      oraclePrices,
    );

    const apr = computeBorrowAPR(borrowRate, blocksPerYear);

    const maxRepayingAmount = computeMaxRepayingAmount(
      marketState,
      borrowRate,
      marketBorrowerInfo,
      blockHeight,
      tokenBalances.uUST,
      fixedGas,
    );

    const invalidTxFee =
      !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedGas);

    return { currentLtv, apr, maxRepayingAmount, invalidTxFee };
  }, [
    blockHeight,
    blocksPerYear,
    borrowRate,
    connectedWallet,
    fixedGas,
    marketBorrowerInfo,
    marketState,
    oraclePrices,
    overseerCollaterals,
    tokenBalances.uUST,
  ]);

  const {
    nextLtv,
    txFee,
    estimatedLiqPrice,
    totalOutstandingLoan,
    sendAmount,
    invalidRepayAmount,
  } = useMemo(() => {
    const nextLtv = computeRepayNextLtv(repayAmount, currentLtv, amountToLtv);

    const estimatedLiqPrice = nextLtv
      ? estimateLiquidationPrice(
          nextLtv,
          overseerWhitelist,
          overseerCollaterals,
          oraclePrices,
        )
      : null;

    const txFee = computeRepayTxFee(repayAmount, tax, fixedGas);

    const totalOutstandingLoan = computeRepayTotalOutstandingLoan(
      repayAmount,
      marketBorrowerInfo,
    );

    const sendAmount = computeRepaySendAmount(repayAmount, txFee);

    const invalidRepayAmount = validateRepayAmount(
      repayAmount,
      tokenBalances.uUST,
    );

    return {
      nextLtv,
      txFee,
      totalOutstandingLoan,
      estimatedLiqPrice,
      sendAmount,
      invalidRepayAmount,
    };
  }, [
    amountToLtv,
    currentLtv,
    fixedGas,
    marketBorrowerInfo,
    oraclePrices,
    overseerCollaterals,
    overseerWhitelist,
    repayAmount,
    tax,
    tokenBalances.uUST,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRepayAmount = useCallback((nextRepayAmount: string) => {
    setRepayAmount(nextRepayAmount as UST);
  }, []);

  const proceed = useCallback(
    (repayAmount: UST, txFee: uUST) => {
      if (!connectedWallet || !repay) {
        return;
      }

      repay({ repayAmount, txFee });
    },
    [connectedWallet, repay],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateRepayAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateRepayAmount],
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
      Repay{' '}
      <p>
        <IconSpan>
          Borrow APR : {formatRate(apr)}%{' '}
          <InfoTooltip>
            Current rate of annualized borrowing interest applied for this
            stablecoin
          </InfoTooltip>
        </IconSpan>
      </p>
    </h1>
  );

  if (
    repayResult?.status === StreamStatus.IN_PROGRESS ||
    repayResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={repayResult.value}
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
          value={repayAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REPAY AMOUNT"
          error={!!invalidRepayAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateRepayAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidRepayAmount}>
          <span>{invalidRepayAmount}</span>
          <span>
            Max:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateRepayAmount(formatUSTInput(demicrofy(maxRepayingAmount)))
              }
            >
              {formatUST(demicrofy(maxRepayingAmount))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            disabled={!connectedWallet}
            maxLtv={bAssetLtvsAvg.max}
            safeLtv={bAssetLtvsAvg.safe}
            dangerLtv={dangerLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={0 as Rate<BigSource>}
            userMaxLtv={currentLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {nextLtv?.lt(currentLtv ?? 0) && (
          <EstimatedLiquidationPrice>
            {estimatedLiqPrice}
          </EstimatedLiquidationPrice>
        )}

        {totalOutstandingLoan && txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label="Total Outstanding Loan">
              {totalOutstandingLoan.lt(0)
                ? 0
                : formatUST(demicrofy(totalOutstandingLoan))}{' '}
              UST
            </TxFeeListItem>
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !repay ||
              !txFee ||
              repayAmount.length === 0 ||
              big(repayAmount).lte(0) ||
              !!invalidTxFee ||
              !!invalidRepayAmount
            }
            onClick={() =>
              txFee && proceed(repayAmount, txFee.toFixed() as uUST)
            }
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

    p {
      color: ${({ theme }) => theme.colors.positive};
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
      color: ${({ theme }) => theme.colors.negative};
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
