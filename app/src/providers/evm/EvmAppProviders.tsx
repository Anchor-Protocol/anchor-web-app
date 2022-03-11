import React from 'react';
import { EvmChainId, EvmWalletProvider, useEvmWallet } from '@libs/evm-wallet';
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

const isSupportedChain = (
  chain: Chain,
  evmChainId: number | undefined,
): boolean => {
  switch (chain) {
    case Chain.Avalanche:
      return (
        evmChainId === EvmChainId.AVALANCHE ||
        evmChainId === EvmChainId.AVALANCHE_FUJI_TESTNET
      );
  }
  return false;
};

const ChainGaurdian = (props: UIElementProps) => {
  const { children } = props;

  const {
    target: { chain },
  } = useDeploymentTarget();

  const { chainId: evmChainId } = useEvmWallet();

  if (
    evmChainId !== undefined &&
    isSupportedChain(chain, evmChainId) === false
  ) {
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
          <BackgroundTxRequestProvider>
            <AppProviders>
              <EvmBalancesProvider>{children}</EvmBalancesProvider>
            </AppProviders>
          </BackgroundTxRequestProvider>
        </EvmAccountProvider>
      </QueryProvider>
    </EvmNetworkProvider>
  );
};

export function EvmAppProviders({ children }: UIElementProps) {
  const {
    target: { chain },
  } = useDeploymentTarget();

  return (
    <EvmWalletProvider>
      <ThemeProvider
        initialTheme="light"
        lightTheme={
          chain === Chain.Ethereum ? ethereumLightTheme : avalancheLightTheme
        }
      >
        <ChainGaurdian>{children}</ChainGaurdian>
      </ThemeProvider>
    </EvmWalletProvider>
  );
}
