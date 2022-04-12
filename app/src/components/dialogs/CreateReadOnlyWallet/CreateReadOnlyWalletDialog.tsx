import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useMemo,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps } from '@libs/use-dialog';
import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import { TextInput } from '@libs/neumorphism-ui/components/TextInput';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';

export interface NetworkInfo {
  name: string;
  chainId: string;
}

export interface CreateReadOnlyWalletFormParams {
  className?: string;
  networks: NetworkInfo[];
  validateAddress: (address: string) => boolean;
}

export type CreateReadOnlyWalletFormReturn = {
  chainId: string;
  address: string;
} | null;

type CreateReadOnlyWalletDialogProps = DialogProps<
  CreateReadOnlyWalletFormParams,
  CreateReadOnlyWalletFormReturn
>;

const CreateReadOnlyWalletDialogBase = ({
  className,
  closeDialog,
  networks,
  validateAddress,
}: CreateReadOnlyWalletDialogProps) => {
  const [chainId, setchainId] = useState<string>(() => networks[1].chainId);
  const [address, setAddress] = useState<string>('');

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !validateAddress(address) ? 'Invalid address' : undefined;
  }, [address, validateAddress]);

  const submit = useCallback(
    (address: string, chainId: string) => {
      if (validateAddress(address)) {
        closeDialog({
          address,
          chainId,
        });
      }
    },
    [closeDialog, validateAddress],
  );

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>View an Address</h1>

        <div className="network-description">
          <p>Network</p>
        </div>

        <NativeSelect
          fullWidth
          value={chainId}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            setchainId(target.value)
          }
        >
          {networks.map(({ chainId, name }) => (
            <option key={chainId} value={chainId}>
              {name} ({chainId})
            </option>
          ))}
        </NativeSelect>

        <div className="address-description">
          <p>Wallet Address</p>
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
              submit(address, chainId);
            }
          }}
        />

        <ActionButton
          className="connect"
          disabled={address.length === 0 || !!invalidAddress}
          onClick={() => submit(address, chainId)}
        >
          View
        </ActionButton>
      </Dialog>
    </Modal>
  );
};

export const CreateReadOnlyWalletDialog = styled(
  CreateReadOnlyWalletDialogBase,
)`
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
