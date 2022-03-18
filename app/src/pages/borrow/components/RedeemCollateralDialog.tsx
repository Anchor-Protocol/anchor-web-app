import { ANCHOR_SAFE_RATIO } from '@anchor-protocol/app-fns';
import { useBorrowRedeemCollateralForm } from '@anchor-protocol/app-provider';
import {
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { bAsset, NoMicro, Rate, u } from '@anchor-protocol/types';
import { TxResultRendering } from '@libs/app-fns';
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
import React, { ChangeEvent, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { LTVGraph } from './LTVGraph';
import { RedeemCollateralFormParams } from './types';
import {
  formatInput,
  formatOutput,
  demicrofy,
  useFormatters,
} from '@anchor-protocol/formatter';
import { BroadcastTxStreamResult } from 'pages/earn/components/types';
import big from 'big.js';

export interface RedeemCollateralDialogParams
  extends UIElementProps,
    RedeemCollateralFormParams {
  txResult: StreamResult<TxResultRendering> | null;
  uTokenBalance: u<bAsset>;
  proceedable: boolean;
  onProceed: (amount: bAsset & NoMicro) => void;
}

export type RedeemCollateralDialogProps =
  DialogProps<RedeemCollateralDialogParams> & {
    renderBroadcastTxResult?: JSX.Element;
  };

function RedeemCollateralDialogBase(props: RedeemCollateralDialogProps) {
  const {
    className,
    closeDialog,
    collateralToken,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
    txResult,
    uTokenBalance,
    tokenDisplay,
    proceedable,
    onProceed,
    renderBroadcastTxResult,
  } = props;

  const { availablePost, connected } = useAccount();

  const {
    ust: {
      formatInput: formatUSTInput,
      formatOutput: formatUSTOutput,
      demicrofy: demicrofyUST,
    },
  } = useFormatters();

  const collateralTokenDecimals = tokenDisplay?.decimals ?? 6;

  const [input, states] = useBorrowRedeemCollateralForm(
    collateralToken,
    collateralTokenDecimals,
    uTokenBalance,
    fallbackBorrowMarket,
    fallbackBorrowBorrower,
  );

  const updateRedeemAmount = useCallback(
    (nextRedeemAmount: bAsset & NoMicro) => {
      input({ redeemAmount: nextRedeemAmount });
    },
    [input],
  );

  const onLtvChange = useCallback(
    (nextLtv: Rate<Big>) => {
      const ltvToAmount = states.ltvToAmount;
      try {
        const nextAmount = ltvToAmount(nextLtv);
        input({
          redeemAmount: formatInput<bAsset>(
            demicrofy(nextAmount, collateralTokenDecimals),
            collateralTokenDecimals,
          ),
        });
      } catch {}
    },
    [input, states.ltvToAmount, collateralTokenDecimals],
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
            updateRedeemAmount(target.value as bAsset)
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
                  formatInput(
                    demicrofy(
                      states.withdrawableAmount,
                      collateralTokenDecimals,
                    ),
                    collateralTokenDecimals,
                  ),
                )
              }
            >
              {states.withdrawableAmount
                ? formatOutput(
                    demicrofy(
                      states.withdrawableAmount,
                      collateralTokenDecimals,
                    ),
                    {
                      decimals: 3,
                    },
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
              ? formatUSTInput(demicrofyUST(states.borrowLimit))
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

        {states.redeemAmount.length > 0 && big(states.txFee).gt(0) && (
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
