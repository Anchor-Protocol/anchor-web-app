import {
  demicrofy,
  formatBAsset,
  formatBAssetInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset, bLuna, CW20Addr, Rate, ubAsset } from '@anchor-protocol/types';
import {
  AnchorTax,
  AnchorTokenBalances,
  BorrowBorrower,
  BorrowMarket,
  computeCurrentLtv,
  computeDepositAmountToBorrowLimit,
  computeDepositAmountToLtv,
  computeLtvToDepositAmount,
  computeProvideCollateralBorrowLimit,
  computeProvideCollateralNextLtv,
  pickCollateral,
  prettifyBAssetSymbol,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
  useBorrowProvideCollateralTx,
  validateDepositAmount,
  validateTxFee,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useCW20TokenBalance } from '@libs/webapp-provider';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ChangeEvent, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
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

export function useProvideCollateralDialog(): [
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

  const [provideCollateral, provideCollateralResult] =
    useBorrowProvideCollateralTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [depositAmount, setDepositAmount] = useState<bAsset>('' as bAsset);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { tokenBalances } = useBank<AnchorTokenBalances, AnchorTax>();

  const ubAssetBalance = useCW20TokenBalance<ubAsset>(collateralToken);

  const {
    data: {
      oraclePrices,
      overseerWhitelist,
      bAssetLtvs,
      bAssetLtvsAvg,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: { marketBorrowerInfo, overseerCollaterals } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const dangerLtv = useMemo(() => {
    return big(bAssetLtvsAvg.max).minus(0.1) as Rate<Big>;
  }, [bAssetLtvsAvg.max]);

  const collateral = useMemo(
    () => pickCollateral(collateralToken, overseerWhitelist),
    [collateralToken, overseerWhitelist],
  );

  const collateralDenom = useMemo(() => {
    return pickCollateralDenom(collateral);
  }, [collateral]);

  const amountToLtv = useMemo(
    () =>
      computeDepositAmountToLtv(
        collateralToken,
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [collateralToken, marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const ltvToAmount = useMemo(
    () =>
      computeLtvToDepositAmount(
        collateralToken,
        marketBorrowerInfo,
        overseerCollaterals,
        oraclePrices,
      ),
    [collateralToken, marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const amountToBorrowLimit = useMemo(
    () =>
      computeDepositAmountToBorrowLimit(
        collateralToken,
        overseerCollaterals,
        oraclePrices,
        bAssetLtvs,
      ),
    [collateralToken, overseerCollaterals, oraclePrices, bAssetLtvs],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useMemo(
    () =>
      computeCurrentLtv(marketBorrowerInfo, overseerCollaterals, oraclePrices),
    [marketBorrowerInfo, overseerCollaterals, oraclePrices],
  );

  const nextLtv = useMemo(
    () =>
      computeProvideCollateralNextLtv(depositAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, depositAmount],
  );

  const borrowLimit = useMemo(
    () =>
      computeProvideCollateralBorrowLimit(depositAmount, amountToBorrowLimit),
    [amountToBorrowLimit, depositAmount],
  );

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(tokenBalances.uUST, fixedGas),
    [connectedWallet, tokenBalances.uUST, fixedGas],
  );

  const invalidDepositAmount = useMemo(() => {
    return validateDepositAmount(depositAmount, ubAssetBalance);
  }, [depositAmount, ubAssetBalance]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as bLuna);
  }, []);

  const proceed = useCallback(
    (depositAmount: bAsset) => {
      if (!connectedWallet || !provideCollateral || !collateralDenom) {
        return;
      }

      provideCollateral({ depositAmount, collateralDenom });
    },
    [collateralDenom, connectedWallet, provideCollateral],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateDepositAmount(formatBAssetInput(demicrofy(nextAmount)));
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
    provideCollateralResult?.status === StreamStatus.IN_PROGRESS ||
    provideCollateralResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={provideCollateralResult.value}
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
            endAdornment: (
              <InputAdornment position="end">
                {prettifyBAssetSymbol(collateral.symbol)}
              </InputAdornment>
            ),
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
                  formatBAssetInput(demicrofy(ubAssetBalance)),
                )
              }
            >
              {formatBAsset(demicrofy(ubAssetBalance))}{' '}
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
            inputMode: 'numeric',
          }}
          style={{ pointerEvents: 'none' }}
        />

        {big(currentLtv ?? 0).gt(0) && (
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
        )}

        {depositAmount.length > 0 && (
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
              !provideCollateral ||
              depositAmount.length === 0 ||
              big(depositAmount).lte(0) ||
              !!invalidTxFee ||
              !!invalidDepositAmount
            }
            onClick={() => proceed(depositAmount)}
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
