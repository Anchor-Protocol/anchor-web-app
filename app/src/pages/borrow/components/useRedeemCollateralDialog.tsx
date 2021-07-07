import {
  demicrofy,
  formatLuna,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bLuna, Rate } from '@anchor-protocol/types';
import { BorrowBorrower, BorrowMarket } from '@anchor-protocol/webapp-fns';
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
import { useBank } from 'contexts/bank';
import big, { Big } from 'big.js';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { validateTxFee } from 'logics/validateTxFee';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { currentLtv as _currentLtv } from '../logics/currentLtv';
import { ltvToRedeemAmount } from '../logics/ltvToRedeemAmount';
import { redeemAmountToLtv } from '../logics/redeemAmountToLtv';
import { redeemCollateralBorrowLimit } from '../logics/redeemCollateralBorrowLimit';
import { redeemCollateralMaxAmount } from '../logics/redeemCollateralMaxAmount';
import { redeemCollateralNextLtv } from '../logics/redeemCollateralNextLtv';
import { redeemCollateralWithdrawableAmount } from '../logics/redeemCollateralWithdrawableAmount';
import { validateRedeemAmount } from '../logics/validateRedeemAmount';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
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
  const [redeemAmount, setRedeemAmount] = useState<bLuna>('' as bLuna);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: {
      bLunaOraclePrice,
      bLunaMaxLtv = '0.5' as Rate,
      bLunaSafeLtv = '0.3' as Rate,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: {
      marketBorrowerInfo: loanAmount,
      bLunaCustodyBorrower: borrowInfo,
    } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () => redeemAmountToLtv(loanAmount, borrowInfo, bLunaOraclePrice),
    [loanAmount, borrowInfo, bLunaOraclePrice],
  );

  const ltvToAmount = useMemo(
    () => ltvToRedeemAmount(loanAmount, borrowInfo, bLunaOraclePrice),
    [loanAmount, borrowInfo, bLunaOraclePrice],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useMemo(
    () => _currentLtv(loanAmount, borrowInfo, bLunaOraclePrice),
    [borrowInfo, loanAmount, bLunaOraclePrice],
  );

  const nextLtv = useMemo(
    () => redeemCollateralNextLtv(redeemAmount, currentLtv, amountToLtv),
    [amountToLtv, currentLtv, redeemAmount],
  );

  const userMaxLtv = useMemo(() => {
    return bLunaMaxLtv;
  }, [bLunaMaxLtv]);

  const withdrawableAmount = useMemo(
    () =>
      redeemCollateralWithdrawableAmount(
        loanAmount,
        borrowInfo,
        bLunaOraclePrice,
        bLunaSafeLtv,
        bLunaMaxLtv,
        nextLtv,
      ),
    [
      bLunaMaxLtv,
      bLunaSafeLtv,
      borrowInfo,
      loanAmount,
      nextLtv,
      bLunaOraclePrice,
    ],
  );

  const withdrawableMaxAmount = useMemo(
    () =>
      redeemCollateralMaxAmount(
        loanAmount,
        borrowInfo,
        bLunaOraclePrice,
        bLunaMaxLtv,
      ),
    [bLunaMaxLtv, borrowInfo, loanAmount, bLunaOraclePrice],
  );

  const borrowLimit = useMemo(
    () =>
      redeemCollateralBorrowLimit(
        redeemAmount,
        borrowInfo,
        bLunaOraclePrice,
        bLunaMaxLtv,
      ),
    [bLunaMaxLtv, borrowInfo, bLunaOraclePrice, redeemAmount],
  );

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidRedeemAmount = useMemo(
    () => validateRedeemAmount(redeemAmount, withdrawableMaxAmount),
    [redeemAmount, withdrawableMaxAmount],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRedeemAmount = useCallback((nextRedeemAmount: string) => {
    setRedeemAmount(nextRedeemAmount as bLuna);
  }, []);

  const proceed = useCallback(
    (redeemAmount: bLuna) => {
      if (!connectedWallet || !redeemCollateral) {
        return;
      }

      redeemCollateral({
        redeemAmount: redeemAmount.length > 0 ? redeemAmount : ('0' as bLuna),
      });
    },
    [connectedWallet, redeemCollateral],
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
            maxLtv={bLunaMaxLtv}
            safeLtv={bLunaSafeLtv}
            dangerLtv={0.4 as Rate<number>}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={userMaxLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {nextLtv?.gt(bLunaSafeLtv) && (
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
