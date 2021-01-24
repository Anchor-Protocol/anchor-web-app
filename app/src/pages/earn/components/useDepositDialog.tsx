import { min } from '@anchor-protocol/big-math';
import { useOperation } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@anchor-protocol/neumorphism-ui/components/useConfirm';
import {
  demicrofy,
  formatUST,
  formatUSTInput,
  microfy,
  UST,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
  uUST,
} from '@anchor-protocol/notation';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import big, { Big } from 'big.js';
import { OperationRenderer } from 'components/OperationRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningMessage } from 'components/WarningMessage';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD } from 'env';
import { depositOptions } from 'pages/earn/operations/depositOptions';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const client = useApolloClient();

  const [deposit, depositResult] = useOperation(depositOptions, {
    addressProvider,
    post,
    client,
  });

  const [openConfirm, confirmElement] = useConfirm();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [depositAmount, setDepositAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const txFee = useMemo<uUST<Big> | undefined>(() => {
    if (depositAmount.length === 0) return undefined;

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas

    const uAmount = microfy(depositAmount);
    const ratioTxFee = big(uAmount.minus(fixedGasUUSD))
      .div(big(1).add(bank.tax.taxRate))
      .mul(bank.tax.taxRate);
    const maxTax = big(bank.tax.maxTaxUUSD);

    if (ratioTxFee.gt(maxTax)) {
      return maxTax.add(fixedGasUUSD) as uUST<Big>;
    } else {
      return ratioTxFee.add(fixedGasUUSD) as uUST<Big>;
    }
  }, [depositAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);

  const invalidTxFee = useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(fixedGasUUSD)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidDepositAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || depositAmount.length === 0) {
      return undefined;
    } else if (
      microfy(depositAmount)
        .plus(txFee ?? 0)
        .gt(bank.userBalances.uUSD ?? 0)
    ) {
      return `Not enough UST`;
    }
    return undefined;
  }, [depositAmount, bank.status, bank.userBalances.uUSD, txFee]);

  const sendAmount = useMemo<uUST<Big> | undefined>(() => {
    return depositAmount.length > 0 && txFee
      ? (microfy(depositAmount).plus(txFee) as uUST<Big>)
      : undefined;
  }, [depositAmount, txFee]);

  const recommendationAssetAmount = useMemo<uUST<Big> | undefined>(() => {
    if (bank.status === 'demo' || big(bank.userBalances.uUSD).lte(0)) {
      return undefined;
    }

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas
    // without_fixed_gas = (uusd balance - fixed_gas)
    // tax_fee = without_fixed_gas * tax_rate
    // without_tax_fee = if (tax_fee < max_tax) without_fixed_gas - tax_fee
    //                   else without_fixed_gas - max_tax

    const userUUSD = big(bank.userBalances.uUSD);
    const withoutFixedGas = userUUSD.minus(fixedGasUUSD);
    const txFee = withoutFixedGas.mul(bank.tax.taxRate);
    const result = withoutFixedGas.minus(min(txFee, bank.tax.maxTaxUUSD));

    return result.lte(0)
      ? undefined
      : (result.minus(fixedGasUUSD) as uUST<Big>);
  }, [
    bank.status,
    bank.tax.maxTaxUUSD,
    bank.tax.taxRate,
    bank.userBalances.uUSD,
  ]);

  const tooMuchAssetAmountWarning = useMemo<ReactNode>(() => {
    if (
      bank.status === 'demo' ||
      depositAmount.length === 0 ||
      !!invalidDepositAmount
    ) {
      return undefined;
    }

    const remainUUSD = big(bank.userBalances.uUSD)
      .minus(microfy(depositAmount))
      .minus(txFee ?? 0);

    if (remainUUSD.lt(fixedGasUUSD)) {
      return `You may run out of USD balance needed for future transactions.`;
    }

    return undefined;
  }, [
    depositAmount,
    bank.status,
    bank.userBalances.uUSD,
    invalidDepositAmount,
    txFee,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateDepositAmount = useCallback((nextDepositAmount: string) => {
    setDepositAmount(nextDepositAmount as UST);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      assetAmount,
      confirm,
    }: {
      status: WalletStatus;
      assetAmount: string;
      confirm: ReactNode;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
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

      await deposit({
        address: status.status === 'ready' ? status.walletAddress : '',
        amount: assetAmount,
        symbol: 'usd',
      });
    },
    [bank.status, deposit, openConfirm],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    depositResult?.status === 'in-progress' ||
    depositResult?.status === 'done' ||
    depositResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Deposit</h1>
          {depositResult.status === 'done' ? (
            <div>
              <pre>{JSON.stringify(depositResult.data, null, 2)}</pre>
              <ActionButton style={{}} onClick={() => closeDialog()}>
                Close
              </ActionButton>
            </div>
          ) : (
            <OperationRenderer result={depositResult} />
          )}
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        {!!invalidTxFee && <WarningMessage>{invalidTxFee}</WarningMessage>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }) => updateDepositAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidDepositAmount}>
          <span>{invalidDepositAmount}</span>
          <span>
            Max:{' '}
            <span
              style={
                recommendationAssetAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                recommendationAssetAmount &&
                updateDepositAmount(
                  formatUSTInput(demicrofy(recommendationAssetAmount)),
                )
              }
            >
              {recommendationAssetAmount
                ? formatUST(demicrofy(recommendationAssetAmount))
                : 0}{' '}
              UST
            </span>
          </span>
        </div>

        {txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        {tooMuchAssetAmountWarning && recommendationAssetAmount && (
          <WarningMessage style={{ marginTop: 30, marginBottom: 0 }}>
            {tooMuchAssetAmountWarning}
          </WarningMessage>
        )}

        <ActionButton
          className="proceed"
          style={
            tooMuchAssetAmountWarning
              ? {
                  backgroundColor: '#c12535',
                }
              : undefined
          }
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            depositAmount.length === 0 ||
            big(depositAmount).lte(0) ||
            !!invalidDepositAmount
          }
          onClick={() =>
            proceed({
              assetAmount: depositAmount,
              status,
              confirm: tooMuchAssetAmountWarning,
            })
          }
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
      color: #f5356a;
    }
  }

  .receipt {
    margin-top: 30px;
  }

  .proceed {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
