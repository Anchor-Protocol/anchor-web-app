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
import styled from 'styled-components';

const EvmWalletSelectorBase = ({ className }: { className: string }) => {
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
      className={className}
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

const EvmWalletSelector = styled(EvmWalletSelectorBase)`
  .restore-tx {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
    margin-bottom: 10px;
  }

  .restore-tx-inner {
    width: auto;
  }

  .link {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

export { EvmWalletSelector };
