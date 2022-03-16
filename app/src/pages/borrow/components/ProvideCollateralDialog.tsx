import { useBorrowProvideCollateralForm } from '@anchor-protocol/app-provider';
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset, NoMicro, Rate, u } from '@anchor-protocol/types';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import type { DialogProps } from '@libs/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import big, { Big } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { IconLineSeparator } from 'components/primitives/IconLineSeparator';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { useAccount } from 'contexts/account';
import { ChangeEvent, useMemo } from 'react';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { LTVGraph } from './LTVGraph';
import { UIElementProps } from '@libs/ui';
import { TxResultRendering } from '@libs/app-fns';
import { ProvideCollateralFormParams } from './types';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import {
  formatInput,
  formatOutput,
  demicrofy,
  useFormatters,
} from '@anchor-protocol/formatter';
import { BroadcastTxStreamResult } from 'pages/earn/components/types';

export interface ProvideCollateralDialogParams
  extends UIElementProps,
    ProvideCollateralFormParams {
  txResult: StreamResult<TxResultRendering> | null;
  uTokenBalance: u<bAsset>;
  proceedable: boolean;
  onProceed: (amount: bAsset & NoMicro) => void;
}

export type ProvideCollateralDialogProps =
  DialogProps<ProvideCollateralDialogParams> & {
    renderBroadcastTxResult?: JSX.Element;
  };

function ProvideCollateralDialogBase(props: ProvideCollateralDialogProps) {
  const {
    className,
    closeDialog,
    txResult,
    proceedable,
    onProceed,
    collateralToken,
    uTokenBalance,
    tokenDisplay,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
    renderBroadcastTxResult,
  } = props;

  const { connected, availablePost } = useAccount();

  const collateralTokenDecimals = tokenDisplay?.decimals ?? 6;

  const [input, states] = useBorrowProvideCollateralForm(
    collateralToken,
    collateralTokenDecimals,
    uTokenBalance,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const {
    ust: {
      formatInput: formatUSTInput,
      formatOutput: formatUSTOutput,
      demicrofy: demicrofyUST,
    },
  } = useFormatters();

  const updateDepositAmount = useCallback(
    (depositAmount: bAsset & NoMicro) => {
      input({
        depositAmount,
      });
    },
    [input],
  );

  const { ltvToAmount } = states;

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateDepositAmount(
          formatInput<bAsset>(
            demicrofy(nextAmount, collateralTokenDecimals),
            collateralTokenDecimals,
          ),
        );
      } catch {}
    },
    [updateDepositAmount, ltvToAmount, collateralTokenDecimals],
  );

  const renderBroadcastTx = useMemo(() => {
    if (renderBroadcastTxResult) {
      return renderBroadcastTxResult;
    }

    return (
      <TxResultRenderer
        resultRendering={(txResult as BroadcastTxStreamResult).value}
        onExit={closeDialog}
      />
    );
  }, [renderBroadcastTxResult, closeDialog, txResult]);

  if (
    txResult?.status === StreamStatus.IN_PROGRESS ||
    txResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>{renderBroadcastTx}</Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>
          <IconSpan>
            Provide Collateral{' '}
            <InfoTooltip>
              Provide bAssets as collateral to borrow stablecoins
            </InfoTooltip>
          </IconSpan>
        </h1>

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
            updateDepositAmount(target.value as bAsset)
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
                  formatInput<bAsset>(
                    demicrofy(
                      states.userBAssetBalance,
                      collateralTokenDecimals,
                    ),
                    collateralTokenDecimals,
                  ),
                )
              }
            >
              {formatOutput(
                demicrofy(states.userBAssetBalance, collateralTokenDecimals),
                {
                  decimals: collateralTokenDecimals,
                },
              )}{' '}
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
              ? formatUSTInput(demicrofyUST(states.borrowLimit))
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
              disabled={!connected}
              start={0}
              end={states.currentLtv?.toNumber() ?? 0}
              value={states.nextLtv}
              onChange={onLtvChange}
              onStep={states.ltvStepFunction}
            />
          </figure>
        )}

        {states.depositAmount.length > 0 && big(states.txFee).gt(0) && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUSTOutput(demicrofyUST(states.txFee))} UST
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
            onClick={() => onProceed(states.depositAmount)}
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
      </Dialog>
    </Modal>
  );
}

export const ProvideCollateralDialog = styled(ProvideCollateralDialogBase)`
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
