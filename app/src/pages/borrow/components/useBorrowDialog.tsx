import {
  demicrofy,
  formatRate,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Rate, UST } from '@anchor-protocol/types';
import {
  BorrowBorrowerData,
  BorrowMarketData,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowBorrowTx,
  useBorrowMarketQuery,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { min } from '@terra-dev/big-math';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@terra-dev/neumorphism-ui/components/useConfirm';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from 'base/contexts/bank';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import { validateTxFee } from 'logics/validateTxFee';
import type { ChangeEvent, ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { apr as _apr } from '../logics/apr';
import { borrowAmountToLtv } from '../logics/borrowAmountToLtv';
import { borrowMax } from '../logics/borrowMax';
import { borrowNextLtv } from '../logics/borrowNextLtv';
import { borrowReceiveAmount } from '../logics/borrowReceiveAmount';
import { borrowSafeMax } from '../logics/borrowSafeMax';
import { borrowTxFee } from '../logics/borrowTxFee';
import { currentLtv as _currentLtv } from '../logics/currentLtv';
import { ltvToBorrowAmount } from '../logics/ltvToBorrowAmount';
import { validateBorrowAmount } from '../logics/validateBorrowAmount';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  fallbackBorrowMarket: BorrowMarketData;
  fallbackBorrowBorrower: BorrowBorrowerData;
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
    constants: { fixedGas, blocksPerYear },
  } = useAnchorWebapp();

  const [borrow, borrowResult] = useBorrowBorrowTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [borrowAmount, setBorrowAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const {
    data: {
      borrowRate,
      oraclePrice,
      bLunaMaxLtv = '0.5' as Rate,
      bLunaSafeLtv = '0.3' as Rate,
    } = fallbackBorrowMarket,
  } = useBorrowMarketQuery();

  const {
    data: {
      marketBorrowerInfo: loanAmount,
      custodyBorrower: borrowInfo,
    } = fallbackBorrowBorrower,
  } = useBorrowBorrowerQuery();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useMemo(
    () => borrowAmountToLtv(loanAmount, borrowInfo, oraclePrice),
    [loanAmount, borrowInfo, oraclePrice],
  );

  const ltvToAmount = useMemo(
    () => ltvToBorrowAmount(loanAmount, borrowInfo, oraclePrice),
    [loanAmount, borrowInfo, oraclePrice],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const currentLtv = useMemo(
    () => _currentLtv(loanAmount, borrowInfo, oraclePrice),
    [borrowInfo, loanAmount, oraclePrice],
  );

  const nextLtv = useMemo(
    () => borrowNextLtv(borrowAmount, currentLtv, amountToLtv),
    [amountToLtv, borrowAmount, currentLtv],
  );

  const userMaxLtv = useMemo(() => {
    return min(bLunaMaxLtv, big(0.4)) as Rate<BigSource>;
  }, [bLunaMaxLtv]);

  const apr = useMemo(() => _apr(borrowRate, blocksPerYear), [
    blocksPerYear,
    borrowRate,
  ]);

  const safeMax = useMemo(
    () =>
      borrowSafeMax(
        loanAmount,
        borrowInfo,
        oraclePrice,
        bLunaSafeLtv,
        currentLtv,
      ),
    [bLunaSafeLtv, borrowInfo, currentLtv, loanAmount, oraclePrice],
  );

  const max = useMemo(
    () => borrowMax(loanAmount, borrowInfo, oraclePrice, bLunaMaxLtv),
    [bLunaMaxLtv, borrowInfo, loanAmount, oraclePrice],
  );

  const txFee = useMemo(() => borrowTxFee(borrowAmount, bank, fixedGas), [
    bank,
    borrowAmount,
    fixedGas,
  ]);

  const receiveAmount = useMemo(
    () => borrowReceiveAmount(borrowAmount, txFee),
    [borrowAmount, txFee],
  );

  const invalidTxFee = useMemo(
    () => !!connectedWallet && validateTxFee(bank, fixedGas),
    [bank, fixedGas, connectedWallet],
  );

  const invalidBorrowAmount = useMemo(
    () => validateBorrowAmount(borrowAmount, max),
    [borrowAmount, max],
  );

  const invalidOver40Ltv = useMemo(() => {
    return nextLtv?.gt(0.4) ? 'Cannot borrow more than the 40% LTV' : undefined;
  }, [nextLtv]);

  const invalidOverSafeLtv = useMemo(() => {
    return nextLtv?.gt(bLunaSafeLtv)
      ? 'Warning : Are you sure you want to borrow above the recommended LTV?'
      : undefined;
  }, [bLunaSafeLtv, nextLtv]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBorrowAmount = useCallback((nextBorrowAmount: string) => {
    setBorrowAmount(nextBorrowAmount as UST);
  }, []);

  const proceed = useCallback(
    async (borrowAmount: UST, confirm: ReactNode) => {
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

      borrow({ borrowAmount });
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
            {formatRate(bLunaSafeLtv)}% LTV:{' '}
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
            maxLtv={bLunaMaxLtv}
            safeLtv={bLunaSafeLtv}
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
            hide={{ id: 'borrow-ltv', period: 1000 * 60 * 60 * 24 * 5 }}
            style={{ userSelect: 'none', fontSize: 12 }}
          >
            Caution: If the loan-to-value ratio (LTV) reaches the maximum (MAX
            LTV), a portion of your collateral may be immediately liquidated to
            repay part of the loan.
          </MessageBox>
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

        <ActionButton
          className="proceed"
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !borrow ||
            borrowAmount.length === 0 ||
            big(borrowAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBorrowAmount ||
            !!invalidOver40Ltv
          }
          onClick={() => proceed(borrowAmount, invalidOverSafeLtv)}
        >
          Proceed
        </ActionButton>

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
