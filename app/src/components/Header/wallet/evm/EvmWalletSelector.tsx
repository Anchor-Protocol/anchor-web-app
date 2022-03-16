import React, { useCallback, useState } from 'react';
import { getAddress } from 'configurations/evm/addresses';
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
import { UIElementProps } from '@libs/ui';

const EvmWalletSelectorBase = ({ className }: UIElementProps) => {
  const { nativeWalletAddress } = useAccount();

  const { actions, chainId, connection, provider, status } = useEvmWallet();

  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => setOpen((prev) => !prev), []);

  const onClose = useCallback(() => setOpen(false), []);

  const addTokenToMetaMask = useCallback(
    (tokenParams: {
      address: string;
      decimals: number;
      symbol: string;
      image?: string;
    }) => {
      provider?.provider?.request &&
        provider.provider
          .request({
            method: 'wallet_watchAsset',
            params: {
              // @ts-ignore ethers has wrong params type (Array<any>)
              type: 'ERC20',
              options: tokenParams,
            },
          })
          .catch(console.error);
    },
    [provider],
  );

  const onAddUST = useCallback(() => {
    chainId &&
      addTokenToMetaMask({
        address: getAddress(chainId, 'UST'),
        symbol: 'UST',
        decimals: 6,
        image: 'https://s2.coinmarketcap.com/static/img/coins/200x200/7129.png',
      });
  }, [addTokenToMetaMask, chainId]);

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
                  onAddUST={
                    provider?.provider?.isMetaMask ? onAddUST : undefined
                  }
                />
              )}
            </DropdownBox>
          </DropdownContainer>
        )}
      </>
    </WalletSelector>
  );
};

const EvmWalletSelector = styled(EvmWalletSelectorBase)``;

export { EvmWalletSelector };
