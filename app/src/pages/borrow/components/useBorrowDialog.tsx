import {
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, u, UST } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  BorrowBorrower,
  BorrowMarket,
  computeBorrowAmountToLtv,
  computeBorrowAPR,
  computeBorrowMax,
  computeBorrowNextLtv,
  computeBorrowReceiveAmount,
  computeBorrowSafeMax,
  computeBorrowTxFee,
  computeCurrentLtv,
  computeLtvToBorrowAmount,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowBorrowTx,
  useBorrowMarketQuery,
  validateBorrowAmount,
  validateTxFee,
} from '@anchor-protocol/webapp-provider';
import { demicrofy, formatRate } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { useBank } from '@libs/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { EstimatedLiquidationPrice } from 'pages/borrow/components/EstimatedLiquidationPrice';
import { estimateLiquidationPrice } from 'pages/borrow/logics/estimateLiquidationPrice';
import type { ChangeEvent, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  fallbackBorrowMarket: BorrowMarket;
  fallbackBorrowBorrower: BorrowBorrower;
}

type FormReturn = void;

export function useBorrowDialog(): [
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

  const [openConfirm, confirmElement] = useConfirm();

  const {
    constants: { fixedFee, blocksPerYear },
  } = useAnchorWebapp();

  const [borrow, borrowResult] = useBorrowBorrowTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [borrowAmount, setBorrowAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances, tax } = useBank<AnchorTokenBalances, AnchorTax>();

  const {
    data: {
      borrowRate,
      oraclePrices,
      bAssetLtvsAvg,
      overseerWhitelist,
      //bLunaOraclePrice,
      //bLunaMaxLtv = '0.5' as Rate,
      //bLunaSafeLtv = '0.3' as Rate,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: {
      marketBorrowerInfo,
      overseerCollaterals,
      //bLunaCustodyBorrower: borrowInfo,
    } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () =>
      computeBorrowAmountToLtv(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const ltvToAmount = useMemo(
    () =>
      computeLtvToBorrowAmount(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const { currentLtv, userMaxLtv, apr, safeMax, max, invalidTxFee } =
    useMemo(() => {
      const currentLtv = computeCurrentLtv(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      );

      const userMaxLtv = big(bAssetLtvsAvg.max).minus(0.1) as Rate<BigSource>;

      const apr = computeBorrowAPR(borrowRate, blocksPerYear);

      const safeMax = computeBorrowSafeMax(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
        bAssetLtvsAvg.safe,
        currentLtv,
      );

      const max = computeBorrowMax(
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
        bAssetLtvsAvg.max,
      );

      const invalidTxFee =
        !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedFee);
      return {
        currentLtv,
        userMaxLtv,
        apr,
        safeMax,
        max,
        invalidTxFee,
      };
    }, [
      bAssetLtvsAvg.max,
      bAssetLtvsAvg.safe,
      blocksPerYear,
      borrowRate,
      connectedWallet,
      fixedFee,
      marketBorrowerInfo,
      oraclePrices,
      overseerCollaterals,
      tokenBalances.uUST,
    ]);

  const {
    nextLtv,
    txFee,
    receiveAmount,
    estimatedLiqPrice,
    invalidBorrowAmount,
    invalidOver40Ltv,
    invalidOverSafeLtv,
  } = useMemo(() => {
    const nextLtv = computeBorrowNextLtv(borrowAmount, currentLtv, amountToLtv);

    const txFee = computeBorrowTxFee(borrowAmount, tax, fixedFee);

    console.log('useBorrowDialog.tsx..()', overseerCollaterals.collaterals);

    const estimatedLiqPrice = nextLtv
      ? estimateLiquidationPrice(
          nextLtv,
          overseerWhitelist,
          overseerCollaterals,
          oraclePrices,
        )
      : null;

    const receiveAmount = computeBorrowReceiveAmount(borrowAmount, txFee);

    const invalidBorrowAmount = validateBorrowAmount(borrowAmount, max);

    const invalidOver40Ltv = nextLtv?.gt(userMaxLtv)
      ? `Cannot borrow when LTV is above ${formatRate(userMaxLtv)}%.`
      : undefined;

    const invalidOverSafeLtv = nextLtv?.gt(bAssetLtvsAvg.safe)
      ? 'WARNING: Are you sure you want to borrow above the recommended LTV? Crypto markets can be very volatile and you may be subject to liquidation in events of downward price swings of the bAsset.'
      : undefined;

    return {
      nextLtv,
      txFee,
      receiveAmount,
      estimatedLiqPrice,
      invalidBorrowAmount,
      invalidOver40Ltv,
      invalidOverSafeLtv,
    };
  }, [
    amountToLtv,
    bAssetLtvsAvg.safe,
    borrowAmount,
    currentLtv,
    fixedFee,
    max,
    oraclePrices,
    overseerCollaterals,
    overseerWhitelist,
    tax,
    userMaxLtv,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBorrowAmount = useCallback((nextBorrowAmount: string) => {
    setBorrowAmount(nextBorrowAmount as UST);
  }, []);

  const proceed = useCallback(
    async (borrowAmount: UST, txFee: u<UST>, confirm: ReactNode) => {
      if (!connectedWallet || !borrow) {
        return;
      }

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

      borrow({ borrowAmount, txFee });
    },
    [borrow, connectedWallet, openConfirm],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateBorrowAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateBorrowAmount],
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
      Borrow{' '}
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
    borrowResult?.status === StreamStatus.IN_PROGRESS ||
    borrowResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={borrowResult.value}
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
          value={borrowAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="BORROW AMOUNT"
          error={!!invalidBorrowAmount || !!invalidOver40Ltv}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateBorrowAmount(target.value)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div
          className="wallet"
          aria-invalid={!!invalidBorrowAmount || !!invalidOver40Ltv}
        >
          <span>{invalidBorrowAmount ?? invalidOver40Ltv}</span>
          <span>
            {formatRate(bAssetLtvsAvg.safe)}% LTV:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateBorrowAmount(formatUSTInput(demicrofy(safeMax)))
              }
            >
              {formatUST(demicrofy(safeMax))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            disabled={!connectedWallet || max.lte(0)}
            maxLtv={bAssetLtvsAvg.max}
            safeLtv={bAssetLtvsAvg.safe}
            dangerLtv={userMaxLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={userMaxLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {nextLtv?.gt(bAssetLtvsAvg.safe) && (
          <MessageBox
            level="error"
            hide={{ id: 'borrow-ltv', period: 1000 * 60 * 60 * 24 * 5 }}
            style={{ userSelect: 'none', fontSize: 12 }}
          >
            Caution: Borrowing is available only up to {formatRate(userMaxLtv)}%
            LTV. If the loan-to-value ratio (LTV) reaches the maximum (
            {formatRate(bAssetLtvsAvg.max)}% LTV), a portion of your collateral
            may be immediately liquidated to repay part of the loan.
          </MessageBox>
        )}

        {nextLtv?.gt(currentLtv ?? 0) && (
          <EstimatedLiquidationPrice>
            {estimatedLiqPrice}
          </EstimatedLiquidationPrice>
        )}

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
              !borrow ||
              borrowAmount.length === 0 ||
              big(borrowAmount).lte(0) ||
              big(receiveAmount ?? 0).lte(0) ||
              !!invalidTxFee ||
              !!invalidBorrowAmount ||
              !!invalidOver40Ltv
            }
            onClick={() =>
              txFee &&
              proceed(
                borrowAmount,
                txFee.toFixed() as u<UST>,
                invalidOverSafeLtv,
              )
            }
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>

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
