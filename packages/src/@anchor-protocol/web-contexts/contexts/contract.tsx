import type { AddressMap, AddressProvider } from '@anchor-protocol/anchor.js';
import { ContractAddress, CW20Addr, HumanAddr } from '@anchor-protocol/types';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';

export interface ContractProviderProps {
  children: ReactNode;
  addressMap: AddressMap;
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
  addressMap,
}: ContractProviderProps) {
  const state = useMemo<ContractState>(() => {
    const address: ContractAddress = createContractAddress(
      addressProvider,
      addressMap,
    );

    return {
      addressProvider,
      address,
    };
  }, [addressMap, addressProvider]);

  return (
    <ContractContext.Provider value={state}>
      {children}
    </ContractContext.Provider>
  );
}

export function createContractAddress(
  addressProvider: AddressProvider,
  addressMap: AddressMap,
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
      distributionModel: addressMap.mmDistributionModel as HumanAddr,
    },
    liquidation: {
      liquidationContract: addressProvider.liquidation() as HumanAddr,
    },
    anchorToken: {
      gov: addressProvider.gov() as HumanAddr,
      staking: addressProvider.staking() as HumanAddr,
      community: addressProvider.community() as HumanAddr,
      distributor: addressProvider.faucet() as HumanAddr,
      investorLock: 'terra19f6ktw4qpjj9p9m49y8mhf6pr9807d44xdcus7' as HumanAddr,
      teamLock: 'terra1x7ted5g0g6ntyqdaqmjwtzcctvvrdju49vs8pl' as HumanAddr,
    },
    terraswap: {
      blunaLunaPair: addressProvider.terraswapblunaLunaPair() as HumanAddr,
      ancUstPair: addressProvider.terraswapAncUstPair() as HumanAddr,
    },
    cw20: {
      bLuna: addressProvider.blunaToken('') as CW20Addr,
      aUST: addressProvider.aTerra('') as CW20Addr,
      ANC: addressProvider.ANC() as CW20Addr,
      AncUstLP: addressProvider.terraswapAncUstLPToken() as CW20Addr,
      bLunaLunaLP: addressProvider.terraswapblunaLunaLPToken('') as CW20Addr,
    },
  };
}

export function useContractName(): (addr: HumanAddr | CW20Addr) => string {
  const { address } = useContext(ContractContext);

  return (addr: HumanAddr | CW20Addr) => {
    switch (addr) {
      case address.bluna.reward:
        return `bLuna / Reward (${addr})`;
      case address.bluna.hub:
        return `bLuna / Hub (${addr})`;
      case address.moneyMarket.market:
        return `Money Market / Market (${addr})`;
      case address.moneyMarket.custody:
        return `Money Market / Custody (${addr})`;
      case address.moneyMarket.overseer:
        return `Money Market / Overseer (${addr})`;
      case address.moneyMarket.oracle:
        return `Money Market / Oracle (${addr})`;
      case address.moneyMarket.interestModel:
        return `Money Market / Interest Model (${addr})`;
      case address.moneyMarket.distributionModel:
        return `Money Market / Distribution Model (${addr})`;
      case address.liquidation.liquidationContract:
        return `Liquidation (${addr})`;
      case address.anchorToken.gov:
        return `Anchor Token / Gov (${addr})`;
      case address.anchorToken.staking:
        return `Anchor Token / Staking (${addr})`;
      case address.anchorToken.community:
        return `Anchor Token / Community (${addr})`;
      case address.anchorToken.distributor:
        return `Anchor Token / Faucet (${addr})`;
      case address.terraswap.blunaLunaPair:
        return `Terraswap / bLuna-Luna Pair (${addr})`;
      case address.terraswap.ancUstPair:
        return `Terraswap / ANC-UST Pair (${addr})`;
      case address.cw20.bLuna:
        return `bLuna (${addr})`;
      case address.cw20.aUST:
        return `aUST (${addr})`;
      case address.cw20.ANC:
        return `ANC (${addr})`;
      case address.cw20.AncUstLP:
        return `ANC-UST-LP (${addr})`;
      case address.cw20.bLunaLunaLP:
        return `bLuna-Luna-LP (${addr})`;
      default:
        return addr;
    }
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
