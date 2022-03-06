import { ANCHOR_SAFE_RATIO } from '@anchor-protocol/app-fns';
import { useBorrowRedeemCollateralForm } from '@anchor-protocol/app-provider';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import {
  // formatBAsset,
  // formatBAssetInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset, Rate, u } from '@anchor-protocol/types';
import { TxResultRendering } from '@libs/app-fns';
import { demicrofy } from '@libs/formatter';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { UIElementProps } from '@libs/ui';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import { useAccount } from 'contexts/account';
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';
import { LTVGraph } from './LTVGraph';
import { RedeemCollateralFormParams } from './types';

export interface RedeemCollateralDialogParams
  extends UIElementProps,
    RedeemCollateralFormParams {
  txResult: StreamResult<TxResultRendering> | null;
  uTokenBalance: u<bAsset>;
  proceedable: boolean;
  onProceed: (amount: bAsset) => void;
}

export type RedeemCollateralDialogProps =
  DialogProps<RedeemCollateralDialogParams>;

function RedeemCollateralDialogBase(props: RedeemCollateralDialogProps) {
  const {
    className,
    closeDialog,
    collateralToken,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
    txResult,
    uTokenBalance,
    proceedable,
    onProceed,
  } = props;

  const { availablePost, connected } = useAccount();

  const [input, states] = useBorrowRedeemCollateralForm(
    collateralToken,
    uTokenBalance,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const updateRedeemAmount = useCallback(
    (nextRedeemAmount: string) => {
      input({ redeemAmount: nextRedeemAmount as bAsset });
    },
    [input],
  );

  const { native } = useFormatters();

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      const ltvToAmount = states.ltvToAmount;
      try {
        const nextAmount = ltvToAmount(nextLtv);
        input({
          redeemAmount: native.formatInput(native.demicrofy(nextAmount)) as any,
        });
      } catch {}
    },
    [input, states.ltvToAmount, native],
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
        <h1>
          <IconSpan>
            Withdraw Collateral{' '}
            <InfoTooltip>Withdraw bAsset to your wallet</InfoTooltip>
          </IconSpan>
        </h1>

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
                {states.collateral.tokenDisplay?.symbol ??
                  states.collateral.symbol}
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
                  native.formatInput(
                    native.demicrofy(states.withdrawableAmount),
                  ),
                )
              }
            >
              {states.withdrawableAmount
                ? native.formatOutput(
                    native.demicrofy(states.withdrawableAmount),
                  )
                : 0}{' '}
              {states.collateral.tokenDisplay?.symbol ??
                states.collateral.symbol}
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
            disabled={!connected}
            start={states.currentLtv?.toNumber() ?? 0}
            end={1}
            value={states.nextLtv}
            onChange={onLtvChange}
            onStep={states.ltvStepFunction}
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
            Caution: As current borrow usage is above the recommended amount,
            fluctuations in collateral value may trigger immediate liquidations.
            It is strongly recommended to keep the borrow usage below the
            maximum by repaying loans with stablecoins or providing additional
            collateral.
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
              !availablePost ||
              !connected ||
              !states.availablePost ||
              !proceedable
            }
            onClick={() =>
              onProceed(
                states.redeemAmount.length > 0
                  ? states.redeemAmount
                  : ('0' as bAsset),
              )
            }
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
      </Dialog>
    </Modal>
  );
}

export const RedeemCollateralDialog = styled(RedeemCollateralDialogBase)`
  width: 720px;
  touch-action: none;

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
