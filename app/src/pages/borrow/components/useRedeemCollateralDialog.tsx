import {
  BorrowBorrower,
  BorrowMarket,
  prettifySymbol,
  ANCHOR_DANGER_RATIO,
  ANCHOR_SAFE_RATIO,
} from '@anchor-protocol/app-fns';
import {
  useBorrowRedeemCollateralForm,
  useBorrowRedeemCollateralTx,
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
import { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
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

  const [postTx, txResult] = useBorrowRedeemCollateralTx(collateralToken);

  const [input, states] = useBorrowRedeemCollateralForm(
    collateralToken,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateRedeemAmount = useCallback(
    (nextRedeemAmount: string) => {
      input({ redeemAmount: nextRedeemAmount as bAsset });
    },
    [input],
  );

  const proceed = useCallback(
    (redeemAmount: bAsset) => {
      if (!connectedWallet || !postTx) {
        return;
      }

      postTx({
        redeemAmount: redeemAmount.length > 0 ? redeemAmount : ('0' as bAsset),
      });
    },
    [connectedWallet, postTx],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      const ltvToAmount = states.ltvToAmount;
      try {
        const nextAmount = ltvToAmount(nextLtv);
        input({ redeemAmount: formatBAssetInput(demicrofy(nextAmount)) });
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
        Withdraw Collateral{' '}
        <InfoTooltip>Withdraw bAsset to your wallet</InfoTooltip>
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
          value={states.redeemAmount}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="WITHDRAW AMOUNT"
          error={!!states.invalidRedeemAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateRedeemAmount(target.value)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {prettifySymbol(states.collateral.symbol)}
              </InputAdornment>
            ),
          }}
        />

        <div className="wallet" aria-invalid={!!states.invalidRedeemAmount}>
          <span>{states.invalidRedeemAmount}</span>
          <span>
            Withdrawable:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                states.withdrawableAmount &&
                updateRedeemAmount(
                  formatBAssetInput(demicrofy(states.withdrawableAmount)),
                )
              }
            >
              {states.withdrawableAmount
                ? formatBAsset(demicrofy(states.withdrawableAmount))
                : 0}{' '}
              {prettifySymbol(states.collateral.symbol)}
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
          }}
          style={{ pointerEvents: 'none' }}
        />

        <figure className="graph">
          <LTVGraph
            disabled={!connectedWallet}
            borrowLimit={states.borrowLimit}
            start={states.currentLtv?.toNumber() ?? 0}
            end={ANCHOR_DANGER_RATIO}
            value={states.nextLtv}
            onChange={onLtvChange}
          />
        </figure>

        {states.nextLtv?.gt(ANCHOR_SAFE_RATIO) && (
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

        {states.redeemAmount.length > 0 && (
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
            onClick={() => proceed(states.redeemAmount)}
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
