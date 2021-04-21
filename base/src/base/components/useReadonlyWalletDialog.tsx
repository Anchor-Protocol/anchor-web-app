import { Modal } from '@material-ui/core';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { TextInput } from '@terra-dev/neumorphism-ui/components/TextInput';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { AccAddress } from '@terra-money/terra.js';
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
  //const [network, setNetwork] = useState<NetworkInfo>(networks[0]);
  const [address, setAddress] = useState<string>('');

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(address) ? 'Invalid address' : undefined;
  }, [address]);

  const submit = useCallback(
    (terraAddress: string) => {
      if (AccAddress.validate(terraAddress)) {
        closeDialog({
          terraAddress,
          network: networks.reverse()[0],
        });
      }
    },
    [closeDialog, networks],
  );

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>View an address</h1>

        {/* Address */}
        <div className="address-description">
          <p>Wallet Address</p>
          <p />
        </div>

        <TextInput
          className="address"
          fullWidth
          multiline
          placeholder="ADDRESS"
          value={address}
          error={!!invalidAddress}
          helperText={invalidAddress}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAddress(target.value)
          }
        />

        <ActionButton
          className="connect"
          disabled={address.length === 0 || !!invalidAddress}
          onClick={() => submit(address)}
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

  .connect {
    margin-top: 40px;
    width: 100%;
    height: 60px;
  }
`;
