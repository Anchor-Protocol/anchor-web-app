import { useContext, createContext } from 'react';
import { WalletContext } from '@terra-money/wallet-provider';
import { Chain, useDeploymentTarget } from '..';

const UndefinedContext = createContext(undefined);

const useTerraNetwork = () => {
  const { chain } = useDeploymentTarget();

  // this is pretty crude, perhaps there should actually be a <TerraNetworkProvider>
  // which  the underlying chains can update accordingly
  const context = useContext<any>(
    chain === Chain.Terra ? WalletContext : UndefinedContext,
  );

  switch (chain) {
    case Chain.Terra:
      return context.network;
    case Chain.Ethereum:
      return {
        name: 'testnet',
        chainID: 'bombay-12',
        lcd: 'https://bombay-lcd.terra.dev',
      };
  }
};

export { useTerraNetwork };
