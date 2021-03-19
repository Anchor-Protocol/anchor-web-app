import { HumanAddr } from '@anchor-protocol/types';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { Modal } from '@material-ui/core';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { TextInput } from '@terra-dev/neumorphism-ui/components/TextInput';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import { useLocalStorageJson } from '@terra-dev/use-local-storage';
import { AccAddress } from '@terra-money/terra.js';
import {
  WalletHistory,
  walletHistoryKey,
} from 'components/Header/WalletSelector/types';
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

export function useProvideAddressDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const { provideAddress } = useWallet();

  const [
    { walletHistory },
    setWalletHistory,
  ] = useLocalStorageJson<WalletHistory>(walletHistoryKey, () => ({
    walletHistory: [],
  }));

  const [address, setAddress] = useState<string>(
    'terra1zua4zv5ljx8v3vdh6qeftjf7se53lac5xxtq54',
  );

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(address) ? 'Invalid address' : undefined;
  }, [address]);

  const provideWallet = useCallback(
    (address: string) => {
      if (AccAddress.validate(address)) {
        const nextWalletHistory: HumanAddr[] = [
          address as HumanAddr,
          ...walletHistory,
        ];

        setWalletHistory({ walletHistory: nextWalletHistory });

        provideAddress(address as HumanAddr);
        closeDialog();
      }
    },
    [closeDialog, provideAddress, setWalletHistory, walletHistory],
  );

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Provide Wallet Address</h1>

        {/* Address */}
        <div className="address-description">
          <p>Wallet Address</p>
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

        <ActionButton
          className="send"
          disabled={address.length === 0 || !!invalidAddress}
          onClick={() => provideWallet(address)}
        >
          Connect
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
