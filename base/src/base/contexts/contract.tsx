import type { AddressMap, AddressProvider } from '@anchor-protocol/anchor.js';
import { ContractAddress, CW20Addr, HumanAddr } from '@anchor-protocol/types';
import { createAnchorContractAddress } from '@anchor-protocol/webapp-provider';
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

// TODO remove after refactoring done
export function ContractProvider({
  children,
  addressProvider,
  addressMap,
}: ContractProviderProps) {
  const state = useMemo<ContractState>(() => {
    const address: ContractAddress = createAnchorContractAddress(
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

/**
 * @deprecated use insteadof createAnchorContractAddress of @anchor-protocol/webapp-provider
 */
export { createAnchorContractAddress as createContractAddress } from '@anchor-protocol/webapp-provider';

export function useContractNickname(): (addr: HumanAddr | CW20Addr) => string {
  const { address } = useContext(ContractContext);

  return (addr: HumanAddr | CW20Addr) => {
    switch (addr) {
      case address.bluna.reward:
        return `bLuna / Reward`;
      case address.bluna.hub:
        return `bLuna / Hub`;
      case address.moneyMarket.market:
        return `Money Market / Market`;
      case address.moneyMarket.custody:
        return `Money Market / Custody`;
      case address.moneyMarket.overseer:
        return `Money Market / Overseer`;
      case address.moneyMarket.oracle:
        return `Money Market / Oracle`;
      case address.moneyMarket.interestModel:
        return `Money Market / Interest Model`;
      case address.moneyMarket.distributionModel:
        return `Money Market / Distribution Model`;
      case address.liquidation.liquidationContract:
        return `Liquidation`;
      case address.anchorToken.gov:
        return `Anchor Token / Gov`;
      case address.anchorToken.staking:
        return `Anchor Token / Staking`;
      case address.anchorToken.community:
        return `Anchor Token / Community`;
      case address.anchorToken.distributor:
        return `Anchor Token / Distributor`;
      case address.terraswap.blunaLunaPair:
        return `Terraswap / bLuna-Luna Pair`;
      case address.terraswap.ancUstPair:
        return `Terraswap / ANC-UST Pair`;
      case address.cw20.bLuna:
        return `bLuna`;
      case address.cw20.aUST:
        return `aUST`;
      case address.cw20.ANC:
        return `ANC`;
      case address.cw20.AncUstLP:
        return `ANC-UST-LP`;
      case address.cw20.bLunaLunaLP:
        return `bLuna-Luna-LP`;
      default:
        return '';
    }
  };
}

// TODO remove after refactoring done
export function useContract(): ContractState {
  return useContext(ContractContext);
}

/** @deprecated */
export function useAddressProvider(): AddressProvider {
  const { addressProvider } = useContext(ContractContext);
  return addressProvider;
}

// TODO remove after refactoring done
export function useContractAddress(): ContractAddress {
  const { address } = useContext(ContractContext);
  return address;
}

export const ContractConsumer: Consumer<ContractState> =
  ContractContext.Consumer;
