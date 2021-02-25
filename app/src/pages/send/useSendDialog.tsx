import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { SelectAndTextInputContainer } from '@anchor-protocol/neumorphism-ui/components/SelectAndTextInputContainer';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import {
  DialogProps,
  OpenDialog,
  useDialog,
} from '@anchor-protocol/use-dialog';
import {
  Input as MuiInput,
  Modal,
  NativeSelect as MuiNativeSelect,
} from '@material-ui/core';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
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
}

const currencies: Item[] = [{ label: 'ANC', value: 'anc' }];

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [amount, setAmount] = useState<string>('');

  const [currency, setCurrency] = useState<Item>(() => currencies[0]);

  const updateCurrency = useCallback((nextCurrencyValue: string) => {
    setCurrency(
      currencies.find(({ value }) => nextCurrencyValue === value) ??
        currencies[0],
    );
  }, []);

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Send</h1>

        {/*{!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}*/}

        {/* Address */}
        <div className="address-description">
          <p>Send to</p>
          <p />
        </div>

        <TextInput className="address" fullWidth placeholder="ADDRESS" />

        {/* Amount */}
        <div className="amount-description">
          <p>Amount</p>
          <p />
        </div>

        <SelectAndTextInputContainer
          className="amount"
          gridColumns={[120, '1fr']}
          rightHelperText={
            <span>
              Withdrawable:{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                8390.38 UST
              </span>
            </span>
          }
        >
          <MuiNativeSelect
            value={currency}
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
            onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
              setAmount(target.value)
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
            0 UST
          </TxFeeListItem>
        </TxFeeList>

        <ActionButton className="send" onClick={() => console.log('Send!')}>
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
