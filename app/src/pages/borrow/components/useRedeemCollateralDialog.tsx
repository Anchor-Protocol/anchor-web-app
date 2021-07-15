import {
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset, CW20Addr, Rate } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  BorrowBorrower,
  BorrowMarket,
  computeCurrentLtv,
  computeLtvToRedeemAmount,
  computeRedeemAmountToLtv,
  computeRedeemCollateralBorrowLimit,
  computeRedeemCollateralNextLtv,
  computeRedeemCollateralWithdrawableAmount,
  pickCollateral,
  prettifyBAssetSymbol,
  validateRedeemAmount,
  validateTxFee,
} from '@anchor-protocol/webapp-fns';
import {
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useBorrowRedeemCollateralTx,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { TextInput } from '@terra-dev/neumorphism-ui/components/TextInput';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { pickCollateralDenom } from '../logics/pickCollateralDenom';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  collateralToken: CW20Addr;
  fallbackBorrowMarket: BorrowMarket;
  fallbackBorrowBorrower: BorrowBorrower;
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
  collateralToken,
  fallbackBorrowMarket,
  fallbackBorrowBorrower,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const {
    constants: { fixedGas },
  } = useAnchorWebapp();

  const txFee = fixedGas;

  const [redeemCollateral, redeemCollateralResult] =
    useBorrowRedeemCollateralTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [redeemAmount, setRedeemAmount] = useState<bAsset>('' as bAsset);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useBank<AnchorTokenBalances, AnchorTax>();

  const {
    data: {
      oraclePrices,
      bAssetLtvsAvg,
      bAssetLtvs,
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

  console.log(
    JSON.stringify(
      {
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      },
      null,
      2,
    ),
  );

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const collateral = useMemo(
    () => pickCollateral(collateralToken, overseerWhitelist),
    [collateralToken, overseerWhitelist],
  );

  const collateralDenom = useMemo(() => {
    return pickCollateralDenom(collateral);
  }, [collateral]);

  const amountToLtv = useMemo(
    () =>
      computeRedeemAmountToLtv(
        collateralToken,
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [collateralToken, marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const ltvToAmount = useMemo(
    () =>
      computeLtvToRedeemAmount(
        collateralToken,
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [collateralToken, marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const userMaxLtv = useMemo(() => {
    return big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;
  }, [bAssetLtvsAvg.max]);

  const currentLtv = useMemo(
    () =>
      computeCurrentLtv(marketBorrowerInfo, overseerCollaterals, oraclePrices),
    [marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const nextLtv = useMemo(
    () => computeRedeemCollateralNextLtv(redeemAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, redeemAmount],
  );

  const withdrawableAmount = useMemo(
    () =>
      computeRedeemCollateralWithdrawableAmount(
        collateralToken,
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
        bAssetLtvs,
      ),
    [
      collateralToken,
      marketBorrowerInfo,
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    ],
  );

  const borrowLimit = useMemo(
    () =>
      computeRedeemCollateralBorrowLimit(
        collateralToken,
        redeemAmount,
        overseerCollaterals,
        oraclePrices,
        bAssetLtvs,
      ),
    [
      collateralToken,
      redeemAmount,
      overseerCollaterals,
      oraclePrices,
      bAssetLtvs,
    ],
  );

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedGas),
    [connectedWallet, tokenBalances.uUST, fixedGas],
  );

  const invalidRedeemAmount = useMemo(
    () => validateRedeemAmount(redeemAmount, withdrawableAmount),
    [redeemAmount, withdrawableAmount],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRedeemAmount = useCallback((nextRedeemAmount: string) => {
    setRedeemAmount(nextRedeemAmount as bAsset);
  }, []);

  const proceed = useCallback(
    (redeemAmount: bAsset) => {
      if (!connectedWallet || !redeemCollateral || !collateralDenom) {
        return;
      }

      redeemCollateral({
        redeemAmount: redeemAmount.length > 0 ? redeemAmount : ('0' as bAsset),
        collateralDenom,
      });
    },
    [connectedWallet, redeemCollateral, collateralDenom],
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
        Withdraw Collateral{' '}
        <InfoTooltip>Withdraw bAsset to your wallet</InfoTooltip>
      </IconSpan>
    </h1>
  );

  if (
    redeemCollateralResult?.status === StreamStatus.IN_PROGRESS ||
    redeemCollateralResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={redeemCollateralResult.value}
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
          label="WITHDRAW AMOUNT"
          error={!!invalidRedeemAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateRedeemAmount(target.value)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {prettifyBAssetSymbol(collateral.symbol)}
              </InputAdornment>
            ),
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
                withdrawableAmount &&
                updateRedeemAmount(
                  formatLunaInput(demicrofy(withdrawableAmount)),
                )
              }
            >
              {withdrawableAmount
                ? formatLuna(demicrofy(withdrawableAmount))
                : 0}{' '}
              {prettifyBAssetSymbol(collateral.symbol)}
            </span>
          </span>
        </div>

        <IconLineSeparator style={{ margin: '10px 0' }} />

        <TextInput
          className="limit"
          value={borrowLimit ? formatUSTInput(demicrofy(borrowLimit)) : ''}
          label="NEW BORROW LIMIT"
          readOnly
          InputProps={{
            readOnly: true,
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
          style={{ pointerEvents: 'none' }}
        />

        <figure className="graph">
          <LTVGraph
            disabled={!connectedWallet}
            maxLtv={bAssetLtvsAvg.max}
            safeLtv={bAssetLtvsAvg.safe}
            dangerLtv={userMaxLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={bAssetLtvsAvg.max}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {nextLtv?.gt(bAssetLtvsAvg.safe) && (
          <MessageBox
            level="error"
            hide={{
              id: 'redeem-collateral-ltv',
              period: 1000 * 60 * 60 * 24 * 5,
            }}
            style={{ userSelect: 'none', fontSize: 12 }}
          >
            Caution: As current LTV is above recommended LTV, there is an
            increased probability fluctuations in collateral value may trigger
            immediate liquidations. It is strongly recommended to keep the LTV
            below the maximum by repaying loans with stablecoins or providing
            additional collateral.
          </MessageBox>
        )}

        {redeemAmount.length > 0 && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !redeemCollateral ||
              redeemAmount.length === 0 ||
              big(redeemAmount).lte(0) ||
              !!invalidTxFee ||
              !!invalidRedeemAmount
            }
            onClick={() => proceed(redeemAmount)}
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
