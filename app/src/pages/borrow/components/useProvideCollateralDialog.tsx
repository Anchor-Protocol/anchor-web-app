import { BorrowBorrower } from '@anchor-protocol/app-fns';
import {
  BorrowMarketWithDisplay,
  useBorrowProvideCollateralForm,
  useBorrowProvideCollateralTx,
} from '@anchor-protocol/app-provider';
import {
  formatBAsset,
  formatBAssetInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset, CW20Addr, Rate } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import type { DialogProps, OpenDialog } from '@libs/use-dialog';
import { useDialog } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { ChangeEvent, ReactNode } from 'react';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { LTVGraph } from './LTVGraph';

interface FormParams {
  className?: string;
  collateralToken: CW20Addr;
  fallbackBorrowMarket: BorrowMarketWithDisplay;
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

  const [postTx, txResult] = useBorrowProvideCollateralTx(collateralToken);

  const [input, states] = useBorrowProvideCollateralForm(
    collateralToken,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback(
    (nextDepositAmount: string) => {
      input({ depositAmount: nextDepositAmount as bAsset });
    },
    [input],
  );

  const proceed = useCallback(
    (depositAmount: bAsset) => {
      if (!connectedWallet || !postTx) {
        return;
      }

      postTx({
        depositAmount,
      });
    },
    [connectedWallet, postTx],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      const ltvToAmount = states.ltvToAmount;
      try {
        const nextAmount = ltvToAmount(nextLtv);
        input({ depositAmount: formatBAssetInput(demicrofy(nextAmount)) });
      } catch {}
    },
    [input, states.ltvToAmount],
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
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={txResult.value}
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

        {!!states.invalidTxFee && (
          <MessageBox>{states.invalidTxFee}</MessageBox>
        )}

        <NumberInput
          className="amount"
          value={states.depositAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="DEPOSIT AMOUNT"
          error={!!states.invalidDepositAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateDepositAmount(target.value)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {states.collateral.tokenDisplay.symbol}
              </InputAdornment>
            ),
          }}
        />

        <div className="wallet" aria-invalid={!!states.invalidDepositAmount}>
          <span>{states.invalidDepositAmount}</span>
          <span>
            Wallet:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateDepositAmount(
                  formatBAssetInput(demicrofy(states.userBAssetBalance)),
                )
              }
            >
              {formatBAsset(demicrofy(states.userBAssetBalance))}{' '}
              {states.collateral.tokenDisplay.symbol}
            </span>
          </span>
        </div>

        <IconLineSeparator style={{ margin: '10px 0' }} />

        <TextInput
          className="limit"
          value={
            states.borrowLimit
              ? formatUSTInput(demicrofy(states.borrowLimit))
              : ''
          }
          label="NEW BORROW LIMIT"
          readOnly
          InputProps={{
            readOnly: true,
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
            inputMode: 'numeric',
          }}
          style={{ pointerEvents: 'none' }}
        />

        {big(states.currentLtv ?? 0).gt(0) && (
          <figure className="graph">
            <LTVGraph
              disabled={!connectedWallet}
              start={0}
              end={states.currentLtv?.toNumber() ?? 0}
              value={states.nextLtv}
              onChange={onLtvChange}
              onStep={states.ltvStepFunction}
            />
          </figure>
        )}

        {states.depositAmount.length > 0 && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(states.txFee))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ViewAddressWarning>
          <ActionButton
            className="proceed"
            disabled={
              !connectedWallet ||
              !connectedWallet.availablePost ||
              !postTx ||
              !states.availablePost
            }
            onClick={() => proceed(states.depositAmount)}
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
