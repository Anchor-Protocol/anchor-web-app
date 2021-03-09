import type { Denom, Rate } from '@anchor-protocol/types';
import { moneyMarket, uUST } from '@anchor-protocol/types';
import big from 'big.js';
import { useContractAddress } from '@anchor-protocol/web-contexts/contexts/contract';
import { SAFE_RATIO } from '@anchor-protocol/web-contexts/env';
import type { ReactNode } from 'react';
import { Consumer, Context, createContext, useContext, useMemo } from 'react';
import {
  mockupData as marketOverviewMockupData,
  useMarketOverview,
} from '../queries/marketOverview';
import {
  mockupData as marketStateMockupData,
  useMarketState,
} from '../queries/marketState';
import {
  mockupData as marketUserOverviewMockupData,
  useMarketUserOverview,
} from '../queries/marketUserOverview';

export interface MarketProviderProps {
  children: ReactNode;
}

export interface Market {
  ready: boolean;
  currentBlock: number | undefined;
  marketBalance: { Denom: Denom; Amount: uUST }[] | undefined;
  marketState: moneyMarket.market.StateResponse | undefined;
  borrowRate: moneyMarket.interestModel.BorrowRateResponse | undefined;
  oraclePrice: moneyMarket.oracle.PriceResponse | undefined;
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse | undefined;
  loanAmount: moneyMarket.market.BorrowInfoResponse | undefined;
  borrowInfo: moneyMarket.custody.BorrowerResponse | undefined;
  bLunaMaxLtv: Rate | undefined;
  bLunaSafeLtv: Rate | undefined;
  refetch: () => void;
}

// @ts-ignore
const MarketContext: Context<Market> = createContext<Market>();

export function MarketProvider({ children }: MarketProviderProps) {
  const { cw20 } = useContractAddress();

  const {
    data: { currentBlock, marketBalance, marketState },
    refetch: refetchMarketState,
  } = useMarketState();

  const {
    data: { borrowRate, oraclePrice, overseerWhitelist },
  } = useMarketOverview({ marketBalance, marketState });

  const {
    data: { loanAmount, borrowInfo },
  } = useMarketUserOverview({
    currentBlock,
  });

  const bLunaMaxLtv = useMemo(() => {
    return overseerWhitelist?.elems.find(
      ({ collateral_token }) => collateral_token === cw20.bLuna,
    )?.max_ltv;
  }, [cw20.bLuna, overseerWhitelist?.elems]);

  const bLunaSafeLtv = useMemo(() => {
    return bLunaMaxLtv
      ? (big(bLunaMaxLtv).mul(SAFE_RATIO).toString() as Rate)
      : undefined;
  }, [bLunaMaxLtv]);

  const ready = useMemo(() => {
    return (
      typeof currentBlock === 'number' &&
      !!marketBalance &&
      !!marketState &&
      !!borrowRate &&
      !!oraclePrice &&
      !!overseerWhitelist &&
      !!loanAmount &&
      !!borrowInfo &&
      !!bLunaMaxLtv &&
      !!bLunaSafeLtv
    );
  }, [
    currentBlock,
    bLunaMaxLtv,
    bLunaSafeLtv,
    borrowInfo,
    borrowRate,
    loanAmount,
    marketBalance,
    marketState,
    oraclePrice,
    overseerWhitelist,
  ]);

  const state = useMemo<Market>(
    () => ({
      ready,
      currentBlock,
      marketBalance,
      marketState,
      borrowRate,
      oraclePrice,
      overseerWhitelist,
      loanAmount,
      borrowInfo,
      bLunaMaxLtv,
      bLunaSafeLtv,
      refetch: refetchMarketState,
    }),
    [
      ready,
      currentBlock,
      bLunaMaxLtv,
      bLunaSafeLtv,
      borrowInfo,
      borrowRate,
      loanAmount,
      marketBalance,
      marketState,
      oraclePrice,
      overseerWhitelist,
      refetchMarketState,
    ],
  );

  return (
    <MarketContext.Provider value={state}>{children}</MarketContext.Provider>
  );
}

export function useMarket(): Market {
  return useContext(MarketContext);
}

export function useMarketNotNullable(): {
  currentBlock: number;
  marketBalance: { Denom: Denom; Amount: uUST }[];
  marketState: moneyMarket.market.StateResponse;
  borrowRate: moneyMarket.interestModel.BorrowRateResponse;
  oraclePrice: moneyMarket.oracle.PriceResponse;
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse;
  loanAmount: moneyMarket.market.BorrowInfoResponse;
  borrowInfo: moneyMarket.custody.BorrowerResponse;
  bLunaMaxLtv: Rate;
  bLunaSafeLtv: Rate;
  refetch: () => void;
} {
  const {
    currentBlock,
    marketBalance,
    marketState,
    borrowRate,
    oraclePrice,
    overseerWhitelist,
    loanAmount,
    borrowInfo,
    bLunaMaxLtv,
    bLunaSafeLtv,
    refetch,
  } = useContext(MarketContext);

  return {
    currentBlock: currentBlock ?? marketStateMockupData.currentBlock!,
    marketBalance: marketBalance ?? marketStateMockupData.marketBalance!,
    marketState: marketState ?? marketStateMockupData.marketState!,
    borrowRate: borrowRate ?? marketOverviewMockupData.borrowRate!,
    oraclePrice: oraclePrice ?? marketOverviewMockupData.oraclePrice!,
    overseerWhitelist:
      overseerWhitelist ?? marketOverviewMockupData.overseerWhitelist!,
    loanAmount: loanAmount ?? marketUserOverviewMockupData.loanAmount!,
    borrowInfo: borrowInfo ?? marketUserOverviewMockupData.borrowInfo!,
    bLunaMaxLtv: bLunaMaxLtv ?? ('0.7' as Rate),
    bLunaSafeLtv: bLunaSafeLtv ?? ('0.5' as Rate),
    refetch,
  };
}

export const MarketConsumer: Consumer<Market> = MarketContext.Consumer;
