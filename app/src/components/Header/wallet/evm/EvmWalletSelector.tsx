import React, { useCallback, useState } from 'react';
import { useAccount } from 'contexts/account';
import { WalletSelector } from '../../desktop/WalletSelector';
import {
  DropdownContainer,
  DropdownBox,
} from 'components/Header/desktop/DropdownContainer';
import { useEvmWallet } from '@libs/evm-wallet';
import { ConnectionList } from './ConnectionList';
import { Content } from './Content';

const EvmWalletSelector = () => {
  const { nativeWalletAddress } = useAccount();

  const { actions, connection, status } = useEvmWallet();

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => setOpen((prev) => !prev), []);

  const onClose = useCallback(() => setOpen(false), []);

  const disconnectWallet = useCallback(() => {
    onClose();
    actions.deactivate();
  }, [actions, onClose]);

  return (
    <WalletSelector
      walletAddress={nativeWalletAddress}
      initializing={status === 'initialization'}
      onClick={onClick}
      onClose={onClose}
    >
      <>
        {open && (
          <DropdownContainer>
            <DropdownBox>
              {!nativeWalletAddress || !connection ? (
                <ConnectionList onClose={onClose} />
              ) : (
                <Content
                  walletAddress={nativeWalletAddress}
                  connection={connection}
                  onClose={onClose}
                  onDisconnectWallet={disconnectWallet}
                />
              )}
            </DropdownBox>
          </DropdownContainer>
        )}
      </>
    </WalletSelector>
  );
};

export { EvmWalletSelector };
