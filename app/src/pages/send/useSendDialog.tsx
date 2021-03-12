import { min } from '@terra-dev/big-math';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
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
import { Token, UST, uToken, uUST } from '@anchor-protocol/types';
import {
  DialogProps,
  OpenDialog,
  useDialog,
} from '@anchor-protocol/use-dialog';
import { useRestrictedNumberInput } from '@anchor-protocol/use-restricted-input';
import { WalletReady } from '@anchor-protocol/wallet-provider';
import { Bank, useBank } from '@anchor-protocol/web-contexts/contexts/bank';
import { useConstants } from '@anchor-protocol/web-contexts/contexts/contants';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import {
  Input as MuiInput,
  Modal,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { AccAddress } from '@terra-money/terra.js';
import big, { Big, BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TransactionRenderer } from 'components/TransactionRenderer';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { validateTxFee } from 'logics/validateTxFee';
import { CurrencyInfo } from 'pages/send/models/currency';
import { sendOptions } from 'pages/send/transactions/sendOptions';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
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

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { serviceAvailable, walletReady } = useService();

  const { fixedGas } = useConstants();

  const { cw20 } = useContractAddress();

  const [send, sendResult] = useOperation(sendOptions, {});

  const currencies = useMemo<CurrencyInfo[]>(
    () => [
      {
        label: 'UST',
        value: 'usd',
        integerPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
        getWithdrawable: (bank: Bank, fixedGas: uUST<BigSource>) => {
          return big(bank.userBalances.uUSD)
            .minus(
              min(
                big(bank.userBalances.uUSD).mul(bank.tax.taxRate),
                bank.tax.maxTaxUUSD,
              ),
            )
            .minus(fixedGas)
            .toString() as uToken;
        },
        getFormatWithdrawable: (bank: Bank, fixedGas: uUST<BigSource>) => {
          return formatUSTInput(
            demicrofy(
              big(bank.userBalances.uUSD)
                .minus(
                  min(
                    big(bank.userBalances.uUSD).mul(bank.tax.taxRate),
                    bank.tax.maxTaxUUSD,
                  ),
                )
                .minus(fixedGas) as uUST<Big>,
            ),
          );
        },
      },
      {
        label: 'aUST',
        value: 'aust',
        integerPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: UST_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: Bank) => bank.userBalances.uaUST,
        getFormatWithdrawable: (bank: Bank) =>
          formatUSTInput(demicrofy(bank.userBalances.uaUST)),
        cw20Address: cw20.aUST,
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
        cw20Address: cw20.bLuna,
      },
      {
        label: 'ANC',
        value: 'anc',
        integerPoints: ANC_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: Bank) => bank.userBalances.uANC,
        getFormatWithdrawable: (bank: Bank) =>
          formatANCInput(demicrofy(bank.userBalances.uANC)),
        cw20Address: cw20.ANC,
      },
      {
        label: 'ANC-UST-LP',
        value: 'anc-ust-lp',
        integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: Bank) => bank.userBalances.uAncUstLP,
        getFormatWithdrawable: (bank: Bank) =>
          formatLPInput(demicrofy(bank.userBalances.uAncUstLP)),
        cw20Address: cw20.AncUstLP,
      },
      {
        label: 'bLuna-Luna-LP',
        value: 'bluna-luna-lp',
        integerPoints: LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: Bank) => bank.userBalances.ubLunaLunaLP,
        getFormatWithdrawable: (bank: Bank) =>
          formatLPInput(demicrofy(bank.userBalances.ubLunaLunaLP)),
        cw20Address: cw20.bLunaLunaLP,
      },
    ],
    [cw20.ANC, cw20.AncUstLP, cw20.aUST, cw20.bLuna, cw20.bLunaLunaLP],
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [address, setAddress] = useState<string>('');

  const [amount, setAmount] = useState<Token>('' as Token);

  const [currency, setCurrency] = useState<CurrencyInfo>(() => currencies[0]);

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
  const updateCurrency = useCallback(
    (nextCurrencyValue: string) => {
      setCurrency(
        currencies.find(({ value }) => nextCurrencyValue === value) ??
          currencies[0],
      );

      setAmount('' as Token);
    },
    [currencies],
  );

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const txFee = useMemo(() => {
    if (amount.length === 0 || currency.value !== 'usd') {
      return fixedGas;
    }

    return min(
      microfy(amount as UST).mul(bank.tax.taxRate),
      bank.tax.maxTaxUUSD,
    ).plus(fixedGas) as uUST<Big>;
  }, [amount, bank.tax.maxTaxUUSD, bank.tax.taxRate, currency.value, fixedGas]);

  const invalidTxFee = useMemo(
    () => serviceAvailable && validateTxFee(bank, txFee),
    [bank, serviceAvailable, txFee],
  );

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(address) ? 'Invalid address' : undefined;
  }, [address]);

  const invalidAmount = useMemo(() => {
    if (amount.length === 0) return undefined;

    return microfy(amount as Token).gt(currency.getWithdrawable(bank, fixedGas))
      ? 'Not enough assets'
      : undefined;
  }, [amount, currency, bank, fixedGas]);

  const submit = useCallback(
    (
      walletReady: WalletReady,
      toAddress: string,
      currency: CurrencyInfo,
      amount: Token,
    ) => {
      send({
        myAddress: walletReady.walletAddress,
        toAddress,
        amount,
        currency,
      });
    },
    [send],
  );

  if (
    sendResult?.status === 'in-progress' ||
    sendResult?.status === 'done' ||
    sendResult?.status === 'fault'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <TransactionRenderer result={sendResult} onExit={closeDialog} />
        </Dialog>
      </Modal>
    );
  }

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
          error={!!invalidAddress}
          helperText={invalidAddress}
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
                    currency.getFormatWithdrawable(bank, fixedGas) as Token,
                  )
                }
              >
                {currency.getFormatWithdrawable(bank, fixedGas)}{' '}
                {currency.label}
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
          <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
            {formatUST(demicrofy(txFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="send"
          disabled={
            !serviceAvailable ||
            address.length === 0 ||
            amount.length === 0 ||
            !!invalidAddress ||
            !!invalidAmount ||
            !!invalidTxFee ||
            big(currency.getWithdrawable(bank, fixedGas)).lte(0)
          }
          onClick={() =>
            walletReady && submit(walletReady, address, currency, amount)
          }
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
