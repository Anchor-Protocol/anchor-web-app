import { Modal } from '@material-ui/core';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { ReadonlyWalletSession } from '@terra-money/wallet-provider';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { NetworkInfo } from '@terra-money/use-wallet';
import { AccAddress } from '@terra-money/terra.js';
import React, {
  ChangeEvent,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  networks: NetworkInfo[];
}

type FormReturn = ReadonlyWalletSession | null;

export function useReadonlyWalletDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  networks,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [chainID, setChainID] = useState<string>(() => networks[1].chainID);
  const [address, setAddress] = useState<string>('');

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(address) ? 'Invalid address' : undefined;
  }, [address]);

  const submit = useCallback(
    (terraAddress: string, networkChainID: string) => {
      if (AccAddress.validate(terraAddress)) {
        closeDialog({
          terraAddress,
          network:
            networks.find(({ chainID }) => chainID === networkChainID) ??
            networks[0],
        });
      }
    },
    [closeDialog, networks],
  );

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>View an Address</h1>

        {/* Network */}
        <div className="network-description">
          <p>Network</p>
          <p />
        </div>

        <NativeSelect
          fullWidth
          value={chainID}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            setChainID(target.value)
          }
        >
          {networks.map(({ chainID, name }) => (
            <option key={chainID} value={chainID}>
              {name} ({chainID})
            </option>
          ))}
        </NativeSelect>

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
          onKeyPress={({ key }: KeyboardEvent<HTMLInputElement>) => {
            if (key === 'Enter') {
              submit(address, chainID);
            }
          }}
        />

        <ActionButton
          className="connect"
          disabled={address.length === 0 || !!invalidAddress}
          onClick={() => submit(address, chainID)}
        >
          View
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
  .network-description {
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

  .address-description {
    margin-top: 24px;
  }

  .connect {
    margin-top: 40px;
    width: 100%;
    height: 60px;
  }
`;
