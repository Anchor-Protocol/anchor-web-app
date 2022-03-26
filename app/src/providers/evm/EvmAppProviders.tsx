import React from 'react';
import {
  EvmWalletProvider,
  supportedChainIds,
  useEvmWallet,
} from '@libs/evm-wallet';
import { UIElementProps } from '@libs/ui';
import { AppProviders } from 'configurations/app';
import { EvmAccountProvider } from './EvmAccountProvider';
import { EvmBalancesProvider } from './EvmBalancesProvider';
import { EvmNetworkProvider } from './EvmNetworkProvider';
import { ThemeProvider } from 'contexts/theme';
import { lightTheme as ethereumLightTheme } from 'themes/ethereum/lightTheme';
import { lightTheme as avalancheLightTheme } from 'themes/avalanche/lightTheme';
import { Chain, useDeploymentTarget } from '@anchor-protocol/app-provider';
import { QueryProvider } from 'providers/QueryProvider';
import { EvmWrongNetwork } from 'components/EvmWrongNetwork';
import { GlobalStyle } from '@libs/neumorphism-ui/themes/GlobalStyle';
import { BackgroundTxRequestProvider } from 'tx/evm/background';
import { EvmChainId } from '@anchor-protocol/crossanchor-sdk';

const isSupportedChain = (evmChainId?: EvmChainId): boolean => {
  return Boolean(evmChainId) && supportedChainIds.includes(evmChainId!);
};

const ChainGaurdian = (props: UIElementProps) => {
  const { children } = props;
  const { chainId: evmChainId } = useEvmWallet();

  if (evmChainId !== undefined && isSupportedChain(evmChainId) === false) {
    return (
      <>
        <GlobalStyle />
        <EvmWrongNetwork />
      </>
    );
  }

  return (
    <EvmNetworkProvider>
      <QueryProvider>
        <EvmAccountProvider>
          <AppProviders>
            <BackgroundTxRequestProvider>
              <EvmBalancesProvider>{children}</EvmBalancesProvider>
            </BackgroundTxRequestProvider>
          </AppProviders>
        </EvmAccountProvider>
      </QueryProvider>
    </EvmNetworkProvider>
  );
};

export function EvmAppProviders({ children }: UIElementProps) {
  const { target } = useDeploymentTarget();

  return (
    <EvmWalletProvider>
      <ThemeProvider
        initialTheme="light"
        lightTheme={
          target.chain === Chain.Ethereum
            ? ethereumLightTheme
            : avalancheLightTheme
        }
      >
        <ChainGaurdian>{children}</ChainGaurdian>
      </ThemeProvider>
    </EvmWalletProvider>
  );
}
