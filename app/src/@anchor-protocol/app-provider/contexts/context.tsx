import { AddressProvider } from '@anchor-protocol/anchor.js';
import {
  COLLATERAL_DENOMS,
  MARKET_DENOMS,
} from '@anchor-protocol/anchor.js/dist/address-provider/provider';
import { CollateralType, CW20Addr } from '@anchor-protocol/types';
import { App, useApp } from '@libs/app-provider';
import { NetworkInfo } from '@terra-money/use-wallet';
import { useWallet } from '@terra-money/wallet-provider';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { AnchorConstants, AnchorContractAddress } from '../types';

export interface AnchorWebappProviderProps {
  children: ReactNode;
  indexerApiEndpoints: (network: NetworkInfo) => string;
}

export interface AnchorWebapp {
  addressProvider: AddressProvider;
  bAssetsVector: CW20Addr[];
  indexerApiEndpoint: string;
}

const AnchorWebappContext: Context<AnchorWebapp> =
  // @ts-ignore
  createContext<AnchorWebapp>();

export function AnchorWebappProvider({
  children,
  indexerApiEndpoints,
}: AnchorWebappProviderProps) {
  const { network } = useWallet();

  const { contractAddress } = useApp<AnchorContractAddress>();

  const states = useMemo<AnchorWebapp>(() => {
    const addressProvider = new AddressProviderFromContractAddress(
      contractAddress,
    );

    return {
      addressProvider,
      indexerApiEndpoint: indexerApiEndpoints(network),
      bAssetsVector: [contractAddress.cw20.bEth, contractAddress.cw20.bLuna],
    };
  }, [contractAddress, indexerApiEndpoints, network]);

  return (
    <AnchorWebappContext.Provider value={states}>
      {children}
    </AnchorWebappContext.Provider>
  );
}

export function useAnchorWebapp(): App<AnchorContractAddress, AnchorConstants> &
  AnchorWebapp {
  const app = useApp<AnchorContractAddress, AnchorConstants>();
  const anchorApp = useContext(AnchorWebappContext);

  return useMemo(() => {
    return {
      ...app,
      ...anchorApp,
    };
  }, [anchorApp, app]);
}

export const AnchorWebappConsumer: Consumer<AnchorWebapp> =
  AnchorWebappContext.Consumer;

class AddressProviderFromContractAddress implements AddressProvider {
  constructor(private data: AnchorContractAddress) {}

  bLunaReward() {
    return this.data.bluna.reward;
  }
  bLunaHub() {
    return this.data.bluna.hub;
  }
  bLunaValidatorsRegistry() {
    return this.data.bluna.validatorsRegistry;
  }
  bLunaToken() {
    return this.data.cw20.bLuna;
  }
  bEthReward() {
    return this.data.beth.reward;
  }
  bEthToken() {
    return this.data.cw20.bEth;
  }
  market(denom: MARKET_DENOMS) {
    return this.data.moneyMarket.market;
  }
  custody(denom: MARKET_DENOMS, collateral: COLLATERAL_DENOMS) {
    switch (collateral) {
      case COLLATERAL_DENOMS.UBLUNA: {
        return this.data.moneyMarket.collaterals[CollateralType.bLuna].custody;
      }
      case COLLATERAL_DENOMS.UBETH: {
        return this.data.moneyMarket.collaterals[CollateralType.bEth].custody;
      }
    }
    throw new Error(`Unknown collateral type "${collateral}"`);
  }
  overseer(denom: MARKET_DENOMS) {
    return this.data.moneyMarket.overseer;
  }
  aTerra(denom: MARKET_DENOMS) {
    return this.data.cw20.aUST;
  }
  oracle() {
    return this.data.moneyMarket.oracle;
  }
  interest() {
    return this.data.moneyMarket.interestModel;
  }
  liquidation() {
    return this.data.liquidation.liquidationContract;
  }
  terraswapblunaLunaPair() {
    return this.data.terraswap.blunaLunaPair;
  }
  terraswapblunaLunaLPToken() {
    return this.data.cw20.bLunaLunaLP;
  }
  gov() {
    return this.data.anchorToken.gov;
  }
  terraswapAncUstPair() {
    return this.data.terraswap.ancUstPair;
  }
  terraswapAncUstLPToken() {
    return this.data.cw20.AncUstLP;
  }
  collector() {
    return this.data.anchorToken.collector;
  }
  staking() {
    return this.data.anchorToken.staking;
  }
  community() {
    return this.data.anchorToken.community;
  }
  distributor() {
    return this.data.anchorToken.distributor;
  }
  ANC() {
    return this.data.cw20.ANC;
  }
  airdrop() {
    return this.data.bluna.airdropRegistry;
  }
  investorLock() {
    return this.data.anchorToken.investorLock;
  }
  teamLock() {
    return this.data.anchorToken.teamLock;
  }
  liquidationQueue(): string {
    throw new Error('not implemented');
  }
}
