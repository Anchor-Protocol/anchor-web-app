import {
  ANC_INPUT_MAXIMUM_DECIMAL_POINTS,
  ANC_INPUT_MAXIMUM_INTEGER_POINTS,
  AUST_INPUT_MAXIMUM_DECIMAL_POINTS,
  AUST_INPUT_MAXIMUM_INTEGER_POINTS,
  demicrofy,
  formatANCInput,
  formatAUSTInput,
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
  useConnectedWallet,
  ConnectedWallet,
} from '@anchor-protocol/wallet-provider2';
import { Modal, NativeSelect as MuiNativeSelect } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { min } from '@terra-dev/big-math';
import { useOperation } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NumberMuiInput } from '@terra-dev/neumorphism-ui/components/NumberMuiInput';
import { SelectAndTextInputContainer } from '@terra-dev/neumorphism-ui/components/SelectAndTextInputContainer';
import { TextInput } from '@terra-dev/neumorphism-ui/components/TextInput';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import { AccAddress } from '@terra-money/terra.js';
import { Bank, useBank } from 'base/contexts/bank';
import { useConstants } from 'base/contexts/contants';
import { useContractAddress } from 'base/contexts/contract';
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
  const connectedWallet = useConnectedWallet();

  const { fixedGas } = useConstants();

  const { cw20 } = useContractAddress();

  const [send, sendResult] = useOperation(sendOptions, {});

  const currencies = useMemo<CurrencyInfo[]>(
    () => [
      {
        label: 'UST',
        value: 'usd',
        integerPoints: UST_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: UST_INPUT_MAXIMUM_DECIMAL_POINTS,
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
        integerPoints: AUST_INPUT_MAXIMUM_INTEGER_POINTS,
        decimalPoints: AUST_INPUT_MAXIMUM_DECIMAL_POINTS,
        getWithdrawable: (bank: Bank) => bank.userBalances.uaUST,
        getFormatWithdrawable: (bank: Bank) =>
          formatAUSTInput(demicrofy(bank.userBalances.uaUST)),
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
    ],
    [cw20.ANC, cw20.aUST, cw20.bLuna],
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [address, setAddress] = useState<string>('');

  const [amount, setAmount] = useState<Token>('' as Token);

  const [currency, setCurrency] = useState<CurrencyInfo>(() => currencies[0]);

  const [memo, setMemo] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // computed
  // ---------------------------------------------
  //const numberInputHandlers = useRestrictedNumberInput({
  //  maxIntegerPoinsts: currency.integerPoints,
  //  maxDecimalPoints: currency.decimalPoints,
  //});

  const memoWarning = useMemo(() => {
    return memo.trim().length === 0
      ? 'Please double check if the transaction requires a memo'
      : undefined;
  }, [memo]);

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
    () => !!connectedWallet && validateTxFee(bank, txFee),
    [bank, connectedWallet, txFee],
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

  const invalidMemo = useMemo(() => {
    return /[<>]/.test(memo) ? 'Characters < and > are not allowed' : undefined;
  }, [memo]);

  const submit = useCallback(
    async (
      walletReady: ConnectedWallet,
      toAddress: string,
      currency: CurrencyInfo,
      amount: Token,
      txFee: uUST,
      memo: string,
    ) => {
      await send({
        myAddress: walletReady.walletAddress,
        toAddress,
        amount,
        currency,
        txFee,
        memo,
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
          <NumberMuiInput
            placeholder="0"
            value={amount}
            maxIntegerPoinsts={currency.integerPoints}
            maxDecimalPoints={currency.decimalPoints}
            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
              setAmount(target.value as Token)
            }
          />
        </SelectAndTextInputContainer>

        {/* Memo */}
        <div className="memo-description">
          <p>Memo (Optional)</p>
          <p />
        </div>

        <TextInput
          className="memo"
          fullWidth
          placeholder="MEMO"
          value={memo}
          error={!!invalidMemo}
          helperText={invalidMemo}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setMemo(target.value)
          }
        />

        <div className="memo-warning">
          {memoWarning && (
            <WarningMessage>
              <IconSpan wordBreak={false}>
                <Warning /> Please double check if the transaction requires a
                memo
              </IconSpan>
            </WarningMessage>
          )}
        </div>

        <TxFeeList className="receipt">
          <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
            {formatUST(demicrofy(txFee))} UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton
          className="send"
          disabled={
            !connectedWallet ||
            address.length === 0 ||
            amount.length === 0 ||
            !!invalidAddress ||
            !!invalidAmount ||
            !!invalidTxFee ||
            !!invalidMemo ||
            big(currency.getWithdrawable(bank, fixedGas)).lte(0)
          }
          onClick={() =>
            connectedWallet &&
            submit(
              connectedWallet,
              address,
              currency,
              amount,
              txFee.toString() as uUST,
              memo,
            )
          }
        >
          Send
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const WarningMessage = styled.div`
  color: ${({ theme }) => theme.colors.negative};

  text-align: center;

  font-size: 13px;

  padding: 5px;
  border: 1px solid ${({ theme }) => theme.colors.negative};
  border-radius: 5px;

  svg {
    margin-right: 10px;
  }

  margin-bottom: 20px;
`;

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .address-description,
  .amount-description,
  .memo-description {
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
    margin-bottom: 20px;
  }

  .memo-warning {
    padding: 20px 0;

    &:empty {
      min-height: 30px;
    }
  }

  .receipt {
    margin-bottom: 40px;
  }

  .send {
    width: 100%;
    height: 60px;
  }
`;
