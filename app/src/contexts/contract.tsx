import type { AddressProvider } from '@anchor-protocol/anchor.js';
import { ContractAddress, CW20Addr, HumanAddr } from '@anchor-protocol/types';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';

export interface ContractProviderProps {
  children: ReactNode;
  addressProvider: AddressProvider;
}

export interface ContractState {
  addressProvider: AddressProvider;
  address: ContractAddress;
}

// @ts-ignore
const ContractContext: Context<ContractState> = createContext<ContractState>();

export function ContractProvider({
  children,
  addressProvider,
}: ContractProviderProps) {
  const state = useMemo<ContractState>(() => {
    const address: ContractAddress = createContractAddress(addressProvider);

    return {
      addressProvider,
      address,
    };
  }, [addressProvider]);

  return (
    <ContractContext.Provider value={state}>
      {children}
    </ContractContext.Provider>
  );
}

export function createContractAddress(
  addressProvider: AddressProvider,
): ContractAddress {
  return {
    bluna: {
      reward: addressProvider.blunaReward('') as HumanAddr,
      hub: addressProvider.blunaHub('') as HumanAddr,
    },
    moneyMarket: {
      market: addressProvider.market('') as HumanAddr,
      custody: addressProvider.custody('') as HumanAddr,
      overseer: addressProvider.overseer('') as HumanAddr,
      oracle: addressProvider.oracle() as HumanAddr,
      interestModel: addressProvider.interest() as HumanAddr,
    },
    liquidation: {
      liquidationContract: addressProvider.liquidation() as HumanAddr,
    },
    anchorToken: {
      gov: addressProvider.gov() as HumanAddr,
      staking: addressProvider.staking() as HumanAddr,
      community: addressProvider.community() as HumanAddr,
      faucet: addressProvider.faucet() as HumanAddr,
    },
    terraswap: {
      blunaLunaPair: addressProvider.terraswapblunaLunaPair() as HumanAddr,
      blunaLunaLPToken: addressProvider.terraswapblunaLunaLPToken(
        '',
      ) as HumanAddr,
      ancUstPair: addressProvider.terraswapAncUstPair() as HumanAddr,
      ancUstLPToken: addressProvider.terraswapAncUstLPToken() as HumanAddr,
    },
    cw20: {
      bLuna: addressProvider.blunaToken('') as CW20Addr,
      aUST: addressProvider.aTerra('') as CW20Addr,
      ANC: addressProvider.ANC() as CW20Addr,
    },
  };
}

export function useContract(): ContractState {
  return useContext(ContractContext);
}

/** @deprecated */
export function useAddressProvider(): AddressProvider {
  const { addressProvider } = useContext(ContractContext);
  return addressProvider;
}

export function useContractAddress(): ContractAddress {
  const { address } = useContext(ContractContext);
  return address;
}

export const ContractConsumer: Consumer<ContractState> =
  ContractContext.Consumer;
