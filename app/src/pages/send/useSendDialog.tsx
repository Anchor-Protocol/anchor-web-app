import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANCInput,
  formatLPInput,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  microfy,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { Token, uToken } from '@anchor-protocol/types';
import {
  DialogProps,
  OpenDialog,
  useDialog,
} from '@anchor-protocol/use-dialog';
import { useRestrictedNumberInput } from '@anchor-protocol/use-restricted-input';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import {
  Input as MuiInput,
  Modal,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import big from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { Bank, useBank } from 'contexts/bank';
import { useConstants } from 'contexts/contants';
import { useService, useServiceConnectedMemo } from 'contexts/service';
import { validateTxFee } from 'logics/validateTxFee';
import React, { ChangeEvent, ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useSendDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

interface Item {
  label: string;
  value: string;
  integerPoints: number;
  decimalPoints: number;
  getWithdrawable: (bank: Bank) => uToken;
  getFormatWithdrawable: (bank: Bank) => Token;
}

const currencies: Item[] = [
  {
    label: 'UST',
    value: 'ust',
    integerPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.uUSD,
    getFormatWithdrawable: (bank: Bank) =>
      formatUSTInput(demicrofy(bank.userBalances.uUSD)),
  },
  {
    label: 'aUST',
    value: 'aust',
    integerPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: UST_INPUT_MAXIMUM_DECIMAL_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.uaUST,
    getFormatWithdrawable: (bank: Bank) =>
      formatUSTInput(demicrofy(bank.userBalances.uaUST)),
  },
  {
    label: 'Luna',
    value: 'luna',
    integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.uLuna,
    getFormatWithdrawable: (bank: Bank) =>
      formatLunaInput(demicrofy(bank.userBalances.uLuna)),
  },
  {
    label: 'bLuna',
    value: 'bluna',
    integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.ubLuna,
    getFormatWithdrawable: (bank: Bank) =>
      formatLunaInput(demicrofy(bank.userBalances.ubLuna)),
  },
  {
    label: 'ANC',
    value: 'anc',
    integerPoints: ANC_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.uANC,
    getFormatWithdrawable: (bank: Bank) =>
      formatANCInput(demicrofy(bank.userBalances.uANC)),
  },
  {
    label: 'ANC-UST-LP',
    value: 'anc-ust-lp',
    integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.uAncUstLP,
    getFormatWithdrawable: (bank: Bank) =>
      formatLPInput(demicrofy(bank.userBalances.uAncUstLP)),
  },
  {
    label: 'bLuna-Luna-LP',
    value: 'bluna-luna-lp',
    integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
    decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
    getWithdrawable: (bank: Bank) => bank.userBalances.ubLunaLunaLP,
    getFormatWithdrawable: (bank: Bank) =>
      formatLPInput(demicrofy(bank.userBalances.ubLunaLunaLP)),
  },
];

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [address, setAddress] = useState<string>('');

  const [amount, setAmount] = useState<Token>('' as Token);

  const [currency, setCurrency] = useState<Item>(() => currencies[0]);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // computed
  // ---------------------------------------------
  const { onKeyPress: onNumberInputKeyPress } = useRestrictedNumberInput({
    maxIntegerPoinsts: currency.integerPoints,
    maxDecimalPoints: currency.decimalPoints,
  });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateCurrency = useCallback((nextCurrencyValue: string) => {
    setCurrency(
      currencies.find(({ value }) => nextCurrencyValue === value) ??
        currencies[0],
    );

    setAmount('' as Token);
  }, []);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const invalidTxFee = useServiceConnectedMemo(
    () => validateTxFee(bank, fixedGas),
    [bank, fixedGas],
    undefined,
  );

  const invalidAmount = useServiceConnectedMemo(
    () => {
      if (amount.length === 0) return undefined;

      return big(microfy(amount as Token)).gt(currency.getWithdrawable(bank))
        ? 'Not enough assets'
        : undefined;
    },
    [amount, currency, bank],
    undefined,
  );

  const submit = useCallback((walletReady: WalletReady) => {
    console.log('useSendDialog.tsx..()', walletReady);
  }, []);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Send</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        {/* Address */}
        <div className="address-description">
          <p>Send to</p>
          <p />
        </div>

        <TextInput
          className="address"
          fullWidth
          placeholder="ADDRESS"
          value={address}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAddress(target.value)
          }
        />

        {/* Amount */}
        <div className="amount-description">
          <p>Amount</p>
          <p />
        </div>

        <SelectAndTextInputContainer
          className="amount"
          gridColumns={[120, '1fr']}
          error={!!invalidAmount}
          leftHelperText={invalidAmount}
          rightHelperText={
            <span>
              Withdrawable:{' '}
              <span
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() =>
                  setAmount(
                    demicrofy(
                      currency.getWithdrawable(bank),
                    ).toString() as Token,
                  )
                }
              >
                {currency.getFormatWithdrawable(bank)} {currency.label}
              </span>
            </span>
          }
        >
          <MuiNativeSelect
            value={currency.value}
            onChange={({ target }) => updateCurrency(target.value)}
          >
            {currencies.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </MuiNativeSelect>
          <MuiInput
            placeholder="0"
            value={amount}
            onKeyPress={onNumberInputKeyPress as any}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
              setAmount(target.value as Token)
            }
          />
        </SelectAndTextInputContainer>

        <TxFeeList className="receipt">
          <TxFeeListItem
            label={
              <IconSpan>
                Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
              </IconSpan>
            }
          >
            {formatUST(demicrofy(fixedGas))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="send"
          disabled={
            !serviceAvailable ||
            address.length === 0 ||
            amount.length === 0 ||
            !!invalidAmount ||
            !!invalidTxFee ||
            big(currency.getWithdrawable(bank)).lte(0)
          }
          onClick={() => walletReady && submit(walletReady)}
        >
          Send
        </ActionButton>
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

  .address-description,
  .amount-description {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 12px;
    color: ${({ theme }) => theme.textColor};

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .address {
    margin-bottom: 20px;
  }

  .amount {
    margin-bottom: 30px;
  }

  .receipt {
    margin-bottom: 40px;
  }

  .send {
    width: 100%;
    height: 60px;
  }
`;
